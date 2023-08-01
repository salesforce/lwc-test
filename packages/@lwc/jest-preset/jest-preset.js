/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
module.exports = {
    // Starting jest@27, the default test environment is "node". Force test environment to "jsdom"
    // regardless of the jest version.
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'js', 'html'],
    resolver: require.resolve('@lwc/jest-resolver'),
    transform: {
        '^.+\\.(js|ts|html|css)$': require.resolve('@lwc/jest-transformer'),
    },
    setupFilesAfterEnv: [require.resolve('./src/setup.js')],
    snapshotSerializers: [require.resolve('@lwc/jest-serializer')],
    testMatch: ['**/__tests__/**/?(*.)(spec|test).(js|ts)'],
    coveragePathIgnorePatterns: ['.css$', '.html$'],
};
