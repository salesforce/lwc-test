/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
// Hash tokens with the template-compiler @lwc/rollup-plugin compiles with, so they always match.
const compilerRequire = createRequire(
    createRequire(require.resolve('@lwc/rollup-plugin')).resolve('@lwc/compiler')
);
const { generateScopeTokens } = compilerRequire('@lwc/template-compiler/dist/index.cjs');
// Vite's import of this CJS package gets its own copy, but the serializer require()s it, so register
// into the require() copy (as jest-transformer does) via its absolute path.
const registerImport = [
    `import { createRequire as __lwcCreateRequire } from 'node:module';`,
    `const { addKnownScopeToken } = __lwcCreateRequire(import.meta.url)(${JSON.stringify(
        require.resolve('@lwc/jest-shared')
    )});`,
];

// Same namespace/name @lwc/rollup-plugin passes to the compiler: an alias `?specifier=ns/name`,
// else the last two directories. Tokens follow whichever it is (W-24634599 switches to x/test).
function componentNamespaceAndName(id) {
    const [filename, query] = id.split('?', 2);
    const specifier = new URLSearchParams(query).get('specifier');
    const [namespace, name] =
        specifier?.split('/') ?? path.dirname(filename).split(path.sep).slice(-2);
    return { filename, namespace, name };
}

// Port of jest-transformer's addKnownScopeToken append: register each compiled template's scope
// tokens with @lwc/jest-shared so the snapshot serializer can replace them.
export function lwcKnownScopeTokens() {
    return {
        name: 'lwc-known-scope-tokens',
        transform(code, id) {
            const { filename, namespace, name } = componentNamespaceAndName(id);
            // Same files the lwc() instances compile: templates outside node_modules.
            if (path.extname(filename) !== '.html' || id.includes('/node_modules/')) {
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
