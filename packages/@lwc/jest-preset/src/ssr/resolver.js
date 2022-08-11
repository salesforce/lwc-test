/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const fs = require("fs");
const { extname, basename, resolve, dirname, join } = require("path");
const lwcResolver = require('@lwc/jest-resolver');

const ALLOWLISTED_LWC_PACKAGES = {
    lwc: '@lwc/engine-server',
};

function isValidCSSImport(importee, { basedir }) {
    const ext = extname(importee);
    const isCSS = ext === '.css';
    let fileName = basename(importee, '.css');
    const isScoped = extname(fileName) === '.scoped';
    if (isScoped) {
        fileName = basename(fileName, '.scoped');
    }
    const absPath = resolve(basedir, importee);
    const dir = dirname(absPath);
    const jsFile = join(dir, fileName + '.js');
    const tsFile = join(dir, fileName + '.ts');

    return (
        // if it is a css file
        isCSS &&
        // the css file must exist
        fs.existsSync(absPath) &&
        // there must be a js/ts file with the same name in the same folder
        (fs.existsSync(jsFile) || fs.existsSync(tsFile))
    );
}

module.exports = function (path, options) {
    const effectivePath = path.endsWith('?scoped=true') ? path.substring(0, path.length - 12) : path;

    if (ALLOWLISTED_LWC_PACKAGES[effectivePath]) {
        return options.defaultResolver(require.resolve(ALLOWLISTED_LWC_PACKAGES[effectivePath]), options);
    }

    // If it is a CSS and it exists, we should parse it since it must be rendered in ssr. The default resolver will
    // just replace it with an empty string.
    if (isValidCSSImport(effectivePath, options)) {
        return options.defaultResolver(effectivePath, options);
    }

    return lwcResolver(path, options);
};
