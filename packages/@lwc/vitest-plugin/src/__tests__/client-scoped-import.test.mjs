/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * node:test in .mjs so Jest and the publish glob skip it; run: node --test <this file>.
 */

import { describe } from 'node:test';

import { salesforceScopedImports } from '../index.js';
import { makeLoad } from './utils/load-transform.mjs';

const test = makeLoad(salesforceScopedImports());

describe('@salesforce/client import', () => {
    test(
        'mocks allowlisted formFactor to its fixed value',
        '@salesforce/client/formFactor',
        'Large'
    );
    test('mocks a non-allowlisted resource to the empty string', '@salesforce/client/foo', '');
});
