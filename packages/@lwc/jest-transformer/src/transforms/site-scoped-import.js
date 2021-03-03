/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const { stringScopedImportTransform } = require('./utils');

/*
 * We use the full path to `Id` instead of `@salesforce/site` like other transforms
 * because only retrieving the id is currently supported. This will need to be updated
 * if more properties are exposed.
 */
const SITE_ID_IMPORT_IDENTIFIER = '@salesforce/site/Id';

const DEFAULT_ID = '005000000000000000';

module.exports = function ({ types: t }) {
    return {
        visitor: {
            ImportDeclaration(path) {
                if (path.get('source.value').node.startsWith(SITE_ID_IMPORT_IDENTIFIER)) {
                    stringScopedImportTransform(t, path, SITE_ID_IMPORT_IDENTIFIER, DEFAULT_ID);
                }
            },
        },
    };
};
