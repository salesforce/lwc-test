/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const originalSSRPreset = require('../ssr/jest-preset.js');

module.exports = {
    ...originalSSRPreset,
    snapshotSerializers: [],
    setupFilesAfterEnv: [require.resolve('../ssr-server/jest.ssr-server.setupAfterEnv.js')],
};
