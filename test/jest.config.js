/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
module.exports = {
    displayName: 'integration',
    preset: '@lwc/jest-preset',

    moduleNameMapper: {
        '^smoke/(.+)$': '<rootDir>/src/modules/smoke/$1/$1',
    },
};
