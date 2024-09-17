/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const originalCSRPreset = require('../jest-preset.js');

module.exports = {
    ...originalCSRPreset,
    testEnvironment: require.resolve('@lwc/jest-jsdom-test-env'),
    snapshotSerializers: [],
};
