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
            color: nativeShadow ? 'blue' : 'cyan',
        },

        rootDir: '<rootDir>/packages',
        testMatch: ['**/__tests__/**/?(*.)(test).js'],

        globals: {
            'lwc-jest': {
                nativeShadow,
            },
        },
    };
}

function integration({ nativeShadow }) {
    return {
        displayName: {
            name: `integration (${nativeShadow ? 'native' : 'synthetic'} shadow)`,
            color: nativeShadow ? 'blue' : 'cyan',
        },

        rootDir: '<rootDir>/test',
        preset: '@lwc/jest-preset',
        moduleNameMapper: {
            '^smoke/(.+)$': '<rootDir>/src/modules/smoke/$1/$1',
            '^(components)/(.+)$': '<rootDir>/src/modules/$1/$2/$2',
            '^(logging)/(.+)$': '<rootDir>/src/modules/$1/$2/$2',
        },

        globals: {
            'lwc-jest': {
                nativeShadow,
            },
        },
    };
}

function logging({ nativeShadow, loggingFormatter }) {
    return {
        displayName: {
            name: `logging formatter (${loggingFormatter ? 'enabled' : 'disabled'} feature)(${
                nativeShadow ? 'native' : 'synthetic'
            } shadow)`,
            color: loggingFormatter ? 'yellow' : 'yellowBright',
        },

        rootDir: '<rootDir>/test',
        preset: '@lwc/jest-preset',
        testMatch: ['**/logging/*/__tests__/**/?(*.)(test).js'],
        moduleNameMapper: {
            '^(logging)/(.+)$': '<rootDir>/src/modules/$1/$2/$2',
        },

        globals: {
            'lwc-jest': {
                nativeShadow,
                loggingFormatter,
            },
        },
    };
}

module.exports = {
    projects: [
        unitTest({ nativeShadow: false }),
        unitTest({ nativeShadow: true }),
        integration({ nativeShadow: false }),
        integration({ nativeShadow: true }),
        logging({ nativeShadow: false, loggingFormatter: false }),
        logging({ nativeShadow: false, loggingFormatter: true }),
        logging({ nativeShadow: true, loggingFormatter: false }),
        logging({ nativeShadow: true, loggingFormatter: true }),
        {
            displayName: {
                name: `integration (ssr)`,
                color: 'magenta',
            },

            rootDir: '<rootDir>/test',
            preset: '@lwc/jest-preset/ssr',
            moduleNameMapper: {
                '^ssr/(.+)$': '<rootDir>/src/modules/ssr/$1/$1',
            },
        },
    ],
};
