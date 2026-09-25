/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * @salesforce/apexContinuation/* is a default-method import (callable returning a promise), so it
 * gets the same fake as @salesforce/apex/* — Jest mocks both identically. Separate file mirrors
 * the jest-transformer layout (apex-continuation-scoped-import.test.js).
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

describe('@salesforce/apexContinuation import', () => {
    test('emits a vitest spy that returns a promise', () => {
        const source = loadSpecifier('@salesforce/apexContinuation/StockController.getQuotes');
        assert.match(source, /import \{ vi \} from 'vitest';/);
        assert.match(source, /export default vi\.fn\(\(\) => Promise\.resolve\(\)\);/);
    });

    test('produces the same fake as @salesforce/apex/*', () => {
        assert.equal(
            loadSpecifier('@salesforce/apexContinuation/StockController.getQuotes'),
            loadSpecifier('@salesforce/apex/FooController.fooMethod')
        );
    });
});
