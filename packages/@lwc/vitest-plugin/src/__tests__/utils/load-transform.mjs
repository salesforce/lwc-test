/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * Vitest-plugin analog of jest-transformer's __tests__/utils/test-transform.js. Runs the plugin's
 * resolveId -> load pipeline over a specifier and inspects the emitted virtual module.
 *
 * PARITY NOTE: the plugin operates on the module id, not the import specifiers, so it can't reproduce
 * Jest's "throws on a non-default import" validation (spike 266 §6.4) — those cases have no analog here.
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
