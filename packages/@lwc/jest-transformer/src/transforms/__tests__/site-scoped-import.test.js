/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const test = require('./utils/test-transform').test(require('../site-scoped-import'));

const DEFAULT_ID = '005000000000000000';
  
describe('@salesforce/site/Id import', () => {
    test(
        'does default transformation',
        `
        import id from '@salesforce/site/Id';
    `,
        `
        let id;

        try {
          id = require("@salesforce/site/Id").default;
        } catch (e) {
          id = "${DEFAULT_ID}";
        }
    `
    );

    test(
        'allows non-@salesforce/site/Id named imports',
        `
        import { otherNamed } from './something-valid';
        import id from '@salesforce/site/Id';
    `,
        `
        import { otherNamed } from './something-valid';
        let id;

        try {
          id = require("@salesforce/site/Id").default;
        } catch (e) {
          id = "${DEFAULT_ID}";
        }
    `
    );
});
