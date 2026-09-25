/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * @salesforce/apex imports: full-path methods resolve to a callable spy returning a promise; bare
 * `@salesforce/apex` is a named-import module (refreshApex + spies). The emitted modules import `vi`
 * from 'vitest', so we assert on the generated source here.
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
});

// Bare `@salesforce/apex` (no slash) is a named-import module, distinct from the methods above.
describe('bare @salesforce/apex named imports', () => {
    test('refreshApex is a function returning a resolved promise', () => {
        const source = loadSpecifier('@salesforce/apex');
        assert.match(source, /export const refreshApex = \(\) => Promise\.resolve\(\);/);
    });

    test('a named apex method (getSObjectValue) is an assertable vi.fn() spy', () => {
        const source = loadSpecifier('@salesforce/apex');
        assert.match(source, /import \{ vi \} from 'vitest';/);
        assert.match(source, /export const getSObjectValue = vi\.fn\(\);/);
    });
});
