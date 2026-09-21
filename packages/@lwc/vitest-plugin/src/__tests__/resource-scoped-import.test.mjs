/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * A3 — mirrors jest-transformer/src/transforms/__tests__/resource-scoped-import.test.js.
 * Interim node:test (.mjs hides it from Jest + publish glob); run: node --test <this file>.
 */

import { describe } from 'node:test';

import { salesforceScopedImports } from '../index.js';
import { makeLoad } from './utils/load-transform.mjs';

const test = makeLoad(salesforceScopedImports());

describe('@salesforce/resourceUrl import', () => {
    test('does default transformation', '@salesforce/resourceUrl/foo', 'foo');
    test(
        'does default transformation for namespaced values',
        '@salesforce/resourceUrl/ns__foo',
        'ns__foo'
    );
});
