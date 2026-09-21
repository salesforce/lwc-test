/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * Mirrors jest-transformer/src/transforms/__tests__/label-scoped-import.test.js.
 * node:test in .mjs so Jest and the publish glob skip it; run: node --test <this file>.
 */

import { describe } from 'node:test';

import { salesforceScopedImports } from '../index.js';
import { makeLoad } from './utils/load-transform.mjs';

const test = makeLoad(salesforceScopedImports());

describe('@salesforce/label import', () => {
    test('does default transformation', '@salesforce/label/c.foo', 'c.foo');
    test('does default transformation for namespaced values', '@salesforce/label/ns.foo', 'ns.foo');
    test('does default transformation for legacy @label/ prefix', '@label/c.foo', 'c.foo');
});
