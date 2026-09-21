/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * Vitest-plugin analog of jest-transformer's __tests__/utils/test-transform.js.
 *
 * The Jest transformer rewrote each `import x from '@salesforce/...'` statement with Babel, so its
 * helper ran a Babel transform over source and compared the emitted code. The Vite plugin instead
 * resolves the specifier to a virtual module and `load()`s its source, so this helper runs the
 * plugin's resolveId -> load pipeline over a specifier and inspects the emitted virtual module.
 *
 * NOTE ON PARITY: the Jest per-transform tests also assert the transformer THROWS on a non-default
 * import (`import { x } from '@salesforce/label/...'`). The plugin operates on the module id, not on
 * the import specifiers, so it cannot reproduce that validation — a named import silently resolves to
 * the default export instead. This is a known, deferred behavior difference (spike 266 §6.4), so those
 * Jest "throws error if ..." cases intentionally have no analog here.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

// Must match VIRTUAL_PREFIX in ../index.js.
const VIRTUAL_PREFIX = '\0salesforce:';

export function makeLoad(plugin) {
    // Run the plugin the way Vite would: claim the specifier, then load the virtual id.
    function loadSpecifier(specifier) {
        const resolved = plugin.resolveId(specifier);
        assert.equal(resolved, VIRTUAL_PREFIX + specifier, `plugin should claim ${specifier}`);
        return plugin.load(resolved);
    }

    // Evaluate the emitted ESM so we assert the value a test/component actually receives at runtime.
    async function evalDefault(source) {
        const mod = await import('data:text/javascript,' + encodeURIComponent(source));
        return mod.default;
    }

    // test(name, specifier, expectedValue): assert the specifier mocks to expectedValue — both as
    // emitted source (`export default <literal>;`) and as the evaluated default export.
    return function pluginTest(name, specifier, expectedValue) {
        test(name, async () => {
            const source = loadSpecifier(specifier);
            assert.equal(source, `export default ${JSON.stringify(expectedValue)};`);
            assert.deepEqual(await evalDefault(source), expectedValue);
        });
    };
}
