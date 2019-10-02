/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const { stringScopedImportTransform } = require('./utils');

const PRIVATE_IMPORT_IDENTIFIER = '@salesforce/private/';

module.exports = function({ types: t }) {
    return {
        visitor: {
            ImportDeclaration(path) {
                const importId = path.get('source.value').node;

                if (importId.startsWith(PRIVATE_IMPORT_IDENTIFIER)) {
                    const mockValue = getMockValue(importId);
                    stringScopedImportTransform(t, path, importId, mockValue);
                }
            },
        },
    };
};

function getMockValue(importId) {
    const resource = importId.substring(PRIVATE_IMPORT_IDENTIFIER.length);
    switch (resource) {
        case 'core.appVersion':
            return '224';
        case 'core.securePort':
            return '443';
        case 'core.untrustedContentDomain':
            return '.a.forceusercontent.com';
        default:
            return undefined;
    }
}
