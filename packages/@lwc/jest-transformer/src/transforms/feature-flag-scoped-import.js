/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const { stringScopedImportTransform } = require('./utils');

const FEATURE_FLAG_IMPORT_IDENTIFIER = '@salesforce/featureFlag/';

module.exports = function ({ types: t }) {
    return {
        visitor: {
            ImportDeclaration(path) {
                if (path.get('source.value').node.startsWith(FEATURE_FLAG_IMPORT_IDENTIFIER)) {
                    stringScopedImportTransform(t, path, FEATURE_FLAG_IMPORT_IDENTIFIER);
                }
            },
        },
    };
};
