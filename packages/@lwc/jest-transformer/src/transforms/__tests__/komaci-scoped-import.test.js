/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const test = require('./utils/test-transform').test(require('../komaci-scoped-import'));

describe('@salesforce/komaci import', () => {
    test(
        'does default transformation',
        `
        import komaciModule from '@salesforce/komaci/c__targetModule';
    `,
        `
        let komaciModule;

        try {
          komaciModule = require("@salesforce/komaci/c__targetModule").default;
        } catch (e) {
          komaciModule = "c__targetModule";
        }
    `,
    );
});
