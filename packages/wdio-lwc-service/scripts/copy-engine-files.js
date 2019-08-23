/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const path = require('path');
const fs = require('fs-extra');
const compatPolyfills = require('compat-polyfills');
const { getModulePath } = require('lwc');

module.exports = (options = {}) => {
    const { isCompat } = options;
    const outputDir = path.join(__dirname, './../build/engine');
    const engine = getModulePath('engine', 'umd', isCompat ? 'es5' : 'es2017', 'dev');
    const wire = getModulePath('wire-service', 'umd', isCompat ? 'es5' : 'es2017', 'dev');

    fs.ensureDirSync(outputDir);
    fs.copyFileSync(engine, path.join(outputDir, 'engine.js'));
    fs.copyFileSync(wire, path.join(outputDir, 'wire.js'));
    fs.writeFileSync(
        path.join(outputDir, 'downgrade.js'),
        compatPolyfills.loadDowngrade()
    );
    fs.writeFileSync(
        path.join(outputDir, 'polyfills.js'),
        compatPolyfills.loadPolyfills()
    );
};
