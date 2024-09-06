/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const test = require('./utils/test-transform').test(require('../user-permission-scoped-import'));

describe('@salesforce/userPermission import', () => {
    test(
        'does default transformation',
        `
        import permValue from '@salesforce/userPermission/foo';
    `,
        `
        let permValue;

        try {
          permValue = require("@salesforce/userPermission/foo").default;
        } catch (e) {
          permValue = "foo";
        }
    `
    );

    test(
        'throws error if using named import',
        `
        import { permValue } from '@salesforce/userPermission/foo';
    `,
        undefined,
        'Invalid import from @salesforce/userPermission/foo'
    );

    test(
        'throws error if renamed default imports',
        `
        import { default as resource } from '@salesforce/userPermission/foo';
    `,
        undefined,
        'Invalid import from @salesforce/userPermission/foo'
    );

    test(
        'throws error if renamed multiple default imports',
        `
        import { default as resource, foo } from '@salesforce/userPermission/foo';
    `,
        undefined,
        'Invalid import from @salesforce/userPermission/foo'
    );
});
