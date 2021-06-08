/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
module.exports = {
    projects: [
        {
            displayName: `unit (${process.env.NATIVE_SHADOW ? 'native' : 'synthetic'} shadow)`,
            rootDir: '<rootDir>/packages',

            testMatch: ['**/__tests__/**/?(*.)(test).js'],
        },
        '<rootDir>/test',
    ],
};
