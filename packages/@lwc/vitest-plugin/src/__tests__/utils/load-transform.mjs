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
 * TODO: vitest/vite aren't installed in this OSS repo yet, so these tests run on node:test (in
 * .mjs so Jest and the publish glob skip them; run: node --test <file>). Port them to vitest's
 * test API once the dev dependency lands.
 *
 * The plugin operates on the module id, not the import specifiers, so it can't reproduce Jest's
 * "throws on a non-default import" validation — those cases have no analog here.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

// Must match VIRTUAL_PREFIX in ../index.js.
const VIRTUAL_PREFIX = '\0salesforce:';

export function makeLoad(plugin) {
    function loadSpecifier(specifier) {
        const resolved = plugin.resolveId(specifier);
        assert.equal(resolved, VIRTUAL_PREFIX + specifier, `plugin should claim ${specifier}`);
        return plugin.load(resolved);
    }

    // Evaluate the emitted ESM so we assert the value the component receives at runtime, not just source.
    async function evalDefault(source) {
        const mod = await import('data:text/javascript,' + encodeURIComponent(source));
        return mod.default;
    }

    return function pluginTest(name, specifier, expectedValue) {
        test(name, async () => {
            const source = loadSpecifier(specifier);
            assert.equal(source, `export default ${JSON.stringify(expectedValue)};`);
            assert.deepEqual(await evalDefault(source), expectedValue);
        });
    };
}
