/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
module.exports = {
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'html'],
    snapshotSerializers: [require.resolve('../src/ssr/html-serializer.js')],
    resolver: require.resolve('../src/ssr/resolver.js'),
    transform: {
        '^.+\\.(js|ts|html|css)$': require.resolve('@lwc/jest-transformer/ssr'),
    },
    testMatch: ['**/__tests__/**/?(*.)ssr-(spec|test).(js|ts)'],
    coveragePathIgnorePatterns: ['.css$', '.html$'],
};
