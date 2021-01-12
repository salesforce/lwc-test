/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const { stringScopedImportTransform } = require('./utils');

const ACCESS_CHECK_IMPORT_IDENTIFIER = '@salesforce/accessCheck/';

module.exports = function ({ types: t }) {
    return {
        visitor: {
            ImportDeclaration(path) {
                if (path.get('source.value').node.startsWith(ACCESS_CHECK_IMPORT_IDENTIFIER)) {
                    stringScopedImportTransform(t, path, ACCESS_CHECK_IMPORT_IDENTIFIER);
                }
            },
        },
    };
};
