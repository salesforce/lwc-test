/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const rollupPluginRequire = createRequire(require.resolve('@lwc/rollup-plugin'));
// Filter ids with the same createFilter @lwc/rollup-plugin uses, so include/exclude match exactly.
const { createFilter } = rollupPluginRequire('@rollup/pluginutils');
// Hash tokens with the template-compiler @lwc/rollup-plugin compiles with, so they always match.
const compilerRequire = createRequire(rollupPluginRequire.resolve('@lwc/compiler'));
const { generateScopeTokens } = compilerRequire('@lwc/template-compiler/dist/index.cjs');
// Always load @lwc/jest-shared with require(), never import: Vite's import of this CJS package
// loads a separate copy, and the snapshot serializer reads the require() one. So register into
// that copy (as jest-transformer does) via its absolute path.
const registerImport = [
    `import { createRequire as __lwcCreateRequire } from 'node:module';`,
    `const { addKnownScopeToken } = __lwcCreateRequire(import.meta.url)(${JSON.stringify(
        require.resolve('@lwc/jest-shared')
    )});`,
];

// Same namespace/name @lwc/rollup-plugin passes to the compiler: an alias `?specifier=ns/name`,
// else the last two directories. Tokens follow whichever it is, so they stay right if module ids
// gain a specifier (e.g. x/test).
function componentNamespaceAndName(id) {
    const [filename, query] = id.split('?', 2);
    const specifier = new URLSearchParams(query).get('specifier');
    const [namespace, name] =
        specifier?.split('/') ?? path.dirname(filename).split(path.sep).slice(-2);
    return { filename, namespace, name };
}

// Port of jest-transformer's addKnownScopeToken append: register each compiled template's scope
// tokens with @lwc/jest-shared so the snapshot serializer can replace them. Pass the same
// `exclude` the lwc() instances get, so this registers tokens for exactly the templates they compile.
export function lwcKnownScopeTokens({ exclude } = {}) {
    const filter = createFilter(undefined, exclude);
    return {
        name: 'lwc-known-scope-tokens',
        transform(code, id) {
            const { filename, namespace, name } = componentNamespaceAndName(id);
            if (path.extname(filename) !== '.html' || !filter(filename)) {
                return;
            }
            const { cssScopeTokens } = generateScopeTokens(filename, namespace, name);
            const register = cssScopeTokens.map(
                (token) => `addKnownScopeToken(${JSON.stringify(token)});`
            );
            // Appending moves no existing code, so `map: null` keeps the compiler's sourcemap.
            return { code: [code, ...registerImport, ...register].join('\n'), map: null };
        },
    };
}
