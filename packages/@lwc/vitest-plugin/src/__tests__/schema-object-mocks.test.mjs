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

describe('@salesforce/schema import', () => {
    test('object reference returns { objectApiName }', '@salesforce/schema/Account', {
        objectApiName: 'Account',
    });
    test(
        'field reference returns { objectApiName, fieldApiName }',
        '@salesforce/schema/Account.Name',
        {
            objectApiName: 'Account',
            fieldApiName: 'Name',
        }
    );
    test('spanning field splits on the first dot', '@salesforce/schema/Opportunity.Account.Name', {
        objectApiName: 'Opportunity',
        fieldApiName: 'Account.Name',
    });
});
