/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const fs = require('fs');
const { resolve, extname, join, dirname, basename } = require('path');

const EMPTY_CSS_MOCK = resolve(__dirname, '..', 'resources', 'emptyStyleMock.js');
const EMPTY_HTML_MOCK = resolve(__dirname, '..', 'resources', 'emptyHtmlMock.js');

const WHITELISTED_LWC_PACKAGES = {
    lwc: '@lwc/engine-dom',
    'wire-service': '@lwc/wire-service',
    'wire-service-jest-util': '@salesforce/wire-service-jest-util',
};

// This logic is somewhat the same in the compiler resolution system
// We should try to consolidate it at some point.
function isImplicitHTMLImport(importee, { basedir }) {
    const ext = extname(importee);
    const isHTML = ext === '.html';
    const fileName = basename(importee, '.html');
    const absPath = resolve(basedir, importee);
    const jsFile = join(dirname(absPath), fileName + '.js');

    return (
        isHTML && // if is an HTML file
        fs.existsSync(jsFile) && // There must be a js file with the same name in the same folder
        !fs.existsSync(absPath) // and the html must not exist
    );
}

function getLwcPath(path, options) {
    // If is a special LWC package, resolve it from commonjs
    if (WHITELISTED_LWC_PACKAGES[path]) {
        return require.resolve(WHITELISTED_LWC_PACKAGES[path]);
    }

    // If is a CSS just resolve it to an empty file
    if (extname(path) === '.css') {
        return EMPTY_CSS_MOCK;
    }

    // If is an implicit imported html (auto-binded from the compiler) return an empty file
    if (isImplicitHTMLImport(path, options)) {
        return EMPTY_HTML_MOCK;
    }

    return path;
}

module.exports = function (path, options) {
    return options.defaultResolver(getLwcPath(path, options), options);
};
