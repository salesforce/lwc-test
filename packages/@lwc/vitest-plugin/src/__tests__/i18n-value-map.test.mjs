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

// [specifier, expected value] -- ported from the Jest i18n transform's getMockValue.
const MAPPED = [
    ['@salesforce/i18n/lang', 'en'],
    ['@salesforce/i18n/dir', 'ltr'],
    ['@salesforce/i18n/locale', 'en-US'],
    ['@salesforce/i18n/timeZone', 'America/Los_Angeles'],
    ['@salesforce/i18n/currency', 'USD'],
    ['@salesforce/i18n/firstDayOfWeek', 0],
    ['@salesforce/i18n/dateTime.shortDateFormat', 'M/d/yyyy'],
    ['@salesforce/i18n/dateTime.mediumDateFormat', 'MMM d, yyyy'],
    ['@salesforce/i18n/dateTime.longDateFormat', 'MMMM d, yyyy'],
    ['@salesforce/i18n/dateTime.shortDateTimeFormat', 'M/d/yyyy h:mm a'],
    ['@salesforce/i18n/dateTime.mediumDateTimeFormat', 'MMM d, yyyy h:mm:ss a'],
    ['@salesforce/i18n/dateTime.shortTimeFormat', 'h:mm a'],
    ['@salesforce/i18n/dateTime.mediumTimeFormat', 'h:mm:ss a'],
    ['@salesforce/i18n/number.numberFormat', '#,##0.###'],
    ['@salesforce/i18n/number.percentFormat', '#,##0%'],
    ['@salesforce/i18n/number.currencyFormat', '¤#,##0.00;(¤#,##0.00)'],
    ['@salesforce/i18n/number.currencySymbol', '$'],
];

describe('@salesforce/i18n import', () => {
    for (const [specifier, expected] of MAPPED) {
        test(`maps ${specifier}`, specifier, expected);
    }

    // Jest getMockValue keys off the first dotted segment.
    test('matches on the first dotted segment', '@salesforce/i18n/lang.foo', 'en');
    test(
        'unknown sub-key of a known group returns ""',
        '@salesforce/i18n/dateTime.unknownFormat',
        ''
    );
    test('unmapped key returns ""', '@salesforce/i18n/foo', '');
    test('unmapped namespaced key returns ""', '@salesforce/i18n/foo.bar', '');
});
