/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const fs = require('fs');
const { resolve, extname, join, dirname, basename } = require('path');
const { URLSearchParams } = require('url');
const { addKnownScopedCssFile } = require('@lwc/jest-shared');

const EMPTY_CSS_MOCK = resolve(__dirname, '..', 'resources', 'emptyStyleMock.js');
const EMPTY_HTML_MOCK = resolve(__dirname, '..', 'resources', 'emptyHtmlMock.js');

const ALLOWLISTED_LWC_PACKAGES = {
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
    const dir = dirname(absPath);
    const jsFile = join(dir, fileName + '.js');
    const tsFile = join(dir, fileName + '.ts');

    return (
        // if is an HTML file
        isHTML &&
        // the html must not exist
        !fs.existsSync(absPath) &&
        // there must be a js/ts file with the same name in the same folder
        (fs.existsSync(jsFile) || fs.existsSync(tsFile))
    );
}

function isValidCSSImport(importee, { basedir }) {
    const ext = extname(importee);
    const isCSS = ext === '.css';
    const absPath = resolve(basedir, importee);

    return (
        // if it is a css file
        isCSS &&
        // the css file must exist
        fs.existsSync(absPath)
    );
}

function isValidScriptImport(importee, { basedir }) {
    const absPath = resolve(basedir, importee);
    return fs.existsSync(absPath);
}

function parseForQueryParams(path) {
    // There is a chance that the filename contains a ? character, but Jest itself throws an error in this case.
    // Even if there is a ? in a parent/grandparent folder, this function only parses the immediate path (e.g.
    // `./filename.css`), so it doesn't matter.
    const [filename, search] = path.split('?');
    const params = new URLSearchParams(search);
    return { filename, params };
}

function getLwcPath(path, options) {
    const { filename, params } = parseForQueryParams(path);
    path = filename; // remove query param for scoped styles (`?scoped=true`)
    if (params.get('scoped') === 'true') {
        addKnownScopedCssFile(resolve(options.basedir, path));
    }
    // If is a special LWC package, resolve it from commonjs
    if (ALLOWLISTED_LWC_PACKAGES[path]) {
        return require.resolve(ALLOWLISTED_LWC_PACKAGES[path]);
    }

    // If is an implicit imported html (auto-binded from the compiler) return an empty file
    if (isImplicitHTMLImport(path, options)) {
        return EMPTY_HTML_MOCK;
    }

    // If is an implicit imported CSS just resolve it to an empty file
    if (extname(path) === '.css' && !isValidCSSImport(path, options)) {
        return EMPTY_CSS_MOCK;
    }

    // If the extension is empty, try to infer it
    if (extname(path) === '') {
        if (
            isValidScriptImport(path + '.ts', options) ||
            isValidScriptImport(path + '.js', options)
        ) {
            return path; // the resolution algo will automatically add '.ts'/'.js' as necessary
        }

        // If there is no extension, try to infer a .css path. We do a special check for CSS to handle @imports inside of
        // CSS files, which can be something like `"foo/bar"` resolving to `"foo/bar.css"`, but unlike '.js', Node's
        // resolution algorithm doesn't automatically add the '.css'
        // TODO: this will fail if there is a .js file in the same directory as the .css file. Need a way to distinguish
        // between `@import "foo/bar"` in CSS and `import "foo/bar"` in JS (assuming platform
        // compiler supports this)
        if (isValidCSSImport(path + '.css', options)) {
            return path + '.css';
        }
    }

    return path;
}

module.exports = function (path, options) {
    return options.defaultResolver(getLwcPath(path, options), options);
};
