/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const test = require('./utils/test-transform').test(require('../custom-permission-scoped-import'));

describe('@salesforce/customPermission import', () => {
    test(
        'does default transformation',
        `
        import permValue from '@salesforce/customPermission/foo';
    `,
        `
        let permValue;

        try {
          permValue = require("@salesforce/customPermission/foo").default;
        } catch (e) {
          permValue = "foo";
        }
    `
    );

    test(
        'does default transformation for namespaced values',
        `
        import permValue from '@salesforce/customPermission/ns__foo';
    `,
        `
        let permValue;

        try {
          permValue = require("@salesforce/customPermission/ns__foo").default;
        } catch (e) {
          permValue = "ns__foo";
        }
    `
    );

    test(
        'throws error if using named import',
        `
        import { permValue } from '@salesforce/customPermission/foo';
    `,
        undefined,
        'Invalid import from @salesforce/customPermission/foo'
    );

    test(
        'throws error if renamed default imports',
        `
        import { default as resource } from '@salesforce/customPermission/foo';
    `,
        undefined,
        'Invalid import from @salesforce/customPermission/foo'
    );

    test(
        'throws error if renamed multiple default imports',
        `
        import { default as resource, foo } from '@salesforce/customPermission/foo';
    `,
        undefined,
        'Invalid import from @salesforce/customPermission/foo'
    );
});
