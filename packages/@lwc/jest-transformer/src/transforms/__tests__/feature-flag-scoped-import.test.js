/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const test = require('./utils/test-transform').test(require('../feature-flag-scoped-import'));

describe('@salesforce/featureFlag import', () => {
    test(
        'does default transformation',
        `
        import flag from '@salesforce/featureFlag/TestOnly.org.featureName';
    `,
        `
        let flag;

        try {
          flag = require("@salesforce/featureFlag/TestOnly.org.featureName").default;
        } catch (e) {
          flag = "TestOnly.org.featureName";
        }
    `,
    );
});
