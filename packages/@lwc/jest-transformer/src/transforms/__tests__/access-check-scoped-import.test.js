/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const test = require('./utils/test-transform').test(require('../access-check-scoped-import'));

describe('@salesforce/accessCheck import', () => {
    test(
        'does default transformation',
        `
        import permValue from '@salesforce/accessCheck/Record.recordDataInvalidation';
    `,
        `
        let permValue;

        try {
          permValue = require("@salesforce/accessCheck/Record.recordDataInvalidation").default;
        } catch (e) {
          permValue = "Record.recordDataInvalidation";
        }
    `,
    );

    test(
        'throws error if using named import',
        `
        import { permValue } from '@salesforce/accessCheck/Record.recordDataInvalidation';
    `,
        undefined,
        'Invalid import from @salesforce/accessCheck/Record.recordDataInvalidation',
    );

    test(
        'throws error if renamed default imports',
        `
        import { default as resource } from '@salesforce/accessCheck/Record.recordDataInvalidation';
    `,
        undefined,
        'Invalid import from @salesforce/accessCheck/Record.recordDataInvalidation',
    );

    test(
        'throws error if renamed multiple default imports',
        `
        import { default as resource, Record } from '@salesforce/accessCheck/Record.recordDataInvalidation';
    `,
        undefined,
        'Invalid import from @salesforce/accessCheck/Record.recordDataInvalidation',
    );
});
