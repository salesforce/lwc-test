/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function unitTest({ nativeShadow }) {
    return {
        displayName: {
            name: `unit (${nativeShadow ? 'native' : 'synthetic'} shadow)`,
            color: nativeShadow ? 'blue' : 'cyan'
        },

        rootDir: '<rootDir>/packages',
        testMatch: ['**/__tests__/**/?(*.)(test).js'],

        globals: {
            'lwc-jest': {
                nativeShadow
            }
        },
    };
}

function integration({ nativeShadow }) {
    return {
        displayName: {
            name: `integration (${nativeShadow ? 'native' : 'synthetic'} shadow)`,
            color: nativeShadow ? 'blue' : 'cyan'
        },

        rootDir: '<rootDir>/test',
        preset: '@lwc/jest-preset',
        moduleNameMapper: {
            '^smoke/(.+)$': '<rootDir>/src/modules/smoke/$1/$1',
        },

        globals: {
            'lwc-jest': {
                nativeShadow
            }
        },
    };
}

module.exports = {
    projects: [
        unitTest({ nativeShadow: false }),
        unitTest({ nativeShadow: true }),
        integration({ nativeShadow: false }),
        integration({ nativeShadow: true }),
        {
            displayName: {
                name: `integration (ssr)`,
                color: 'magenta'
            },

            rootDir: '<rootDir>/test',
            preset: '@lwc/jest-ssr-preset'
        }
    ],
};
