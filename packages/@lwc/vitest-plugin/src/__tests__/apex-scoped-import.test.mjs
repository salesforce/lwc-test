/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * @salesforce/apex default-method import resolves to a callable spy returning a promise.
 * The emitted module imports `vi` from 'vitest', so we assert on the generated source here.
 * Interim node:test (.mjs); run: node --test <this file>.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { salesforceScopedImports } from '../index.js';

const VIRTUAL_PREFIX = '\0salesforce:';
const plugin = salesforceScopedImports();

function loadSpecifier(specifier) {
    const resolved = plugin.resolveId(specifier);
    assert.equal(resolved, VIRTUAL_PREFIX + specifier, `plugin should claim ${specifier}`);
    return plugin.load(resolved);
}

describe('@salesforce/apex default-method import', () => {
    test('emits a vitest spy that returns a promise', () => {
        const source = loadSpecifier('@salesforce/apex/FooController.fooMethod');
        assert.match(source, /import \{ vi \} from 'vitest';/);
        assert.match(source, /export default vi\.fn\(\(\) => Promise\.resolve\(\)\);/);
    });

    test('every apex method specifier gets the same mock source (identity via module cache)', () => {
        const a = loadSpecifier('@salesforce/apex/FooController.fooMethod');
        const b = loadSpecifier('@salesforce/apex/BarController.barMethod');
        assert.equal(a, b);
    });

    // Bare `@salesforce/apex` named imports (refreshApex, getSObjectValue) are claimed but fall
    // through to the placeholder — their own story (A8). apexContinuation/* has its own test file.
    test('does not apply to bare @salesforce/apex named imports', () => {
        const source = loadSpecifier('@salesforce/apex');
        assert.doesNotMatch(source, /vi\.fn/);
    });
});
