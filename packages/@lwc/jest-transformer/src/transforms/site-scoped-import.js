/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const babelTemplate = require('@babel/template').default;
const { getImportInfo, stringScopedImportTransform } = require('./utils');

const SITE_ID_IMPORT_IDENTIFIER = '@salesforce/site/';

const DEFAULT_ID = '005000000000000000';

const siteActiveLanguagesTemplate = babelTemplate(`
    let RESOURCE_NAME;
    try {
        RESOURCE_NAME = require(IMPORT_SOURCE).default;
    } catch (e) {
        RESOURCE_NAME = [{ code: 'en-US', label: 'English (US)' }];
    }
`);

const siteDefaultLanguagesTemplate = babelTemplate(`
    let RESOURCE_NAME;
    try {
        RESOURCE_NAME = require(IMPORT_SOURCE).default;
    } catch (e) {
        RESOURCE_NAME = { code: 'en-US', label: 'English (US)' };
    }
`);

function siteDefaultLanguagesScopedImportTransform(t, path) {
    const { importSource, resourceNames } = getImportInfo(path);
    const defaultImport = resourceNames[0];

    path.replaceWithMultiple(
        siteDefaultLanguagesTemplate({
            RESOURCE_NAME: t.identifier(defaultImport),
            IMPORT_SOURCE: t.stringLiteral(importSource),
        })
    );
}

function siteActiveLanguagesScopedImportTransform(t, path) {
    const { importSource, resourceNames } = getImportInfo(path);
    const defaultImport = resourceNames[0];

    path.replaceWithMultiple(
        siteActiveLanguagesTemplate({
            RESOURCE_NAME: t.identifier(defaultImport),
            IMPORT_SOURCE: t.stringLiteral(importSource),
        })
    );
}

module.exports = function ({ types: t }) {
    return {
        visitor: {
            ImportDeclaration(path) {
                const importId = path.get('source.value').node;
                if (importId.startsWith(SITE_ID_IMPORT_IDENTIFIER)) {
                    siteScopedImportTransform(t, path, importId);
                }
            },
        },
    };
};

function siteScopedImportTransform(t, path, importId) {
    importId = importId.substring(SITE_ID_IMPORT_IDENTIFIER.length);
    switch (importId) {
        case 'defaultLanguages':
            siteDefaultLanguagesScopedImportTransform(t, path);
            break;
        case 'activeLanguages':
            siteActiveLanguagesScopedImportTransform(t, path);
            break;
        case 'Id':
            stringScopedImportTransform(t, path, importId, DEFAULT_ID);
            break;
    }
}
