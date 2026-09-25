/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * @salesforce/site/* mock values: known keys return fixed values, unknown keys pass through.
 * Interim node:test (.mjs); run: node --test <this file>.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { salesforceScopedImports } from '../index.js';
import { makeLoad } from './utils/load-transform.mjs';

const plugin = salesforceScopedImports();
const pluginTest = makeLoad(plugin);

describe('@salesforce/site import', () => {
    pluginTest('Id returns the fixed default id', '@salesforce/site/Id', '005000000000000000');
    pluginTest('activeLanguages returns the fixed array', '@salesforce/site/activeLanguages', [
        { code: 'en-US', label: 'English (US)' },
    ]);
    pluginTest('defaultLanguages returns the fixed object', '@salesforce/site/defaultLanguages', {
        code: 'en-US',
        label: 'English (US)',
    });
});

// makeLoad asserts the specifier IS claimed, so pass-through cases assert resolveId directly.
test('unknown site keys are not claimed (pass through to real resolution)', () => {
    assert.equal(plugin.resolveId('@salesforce/site/unknown'), null);
});
