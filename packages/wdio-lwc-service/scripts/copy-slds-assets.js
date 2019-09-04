/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const fs = require('fs-extra');
const path = require('path');

module.exports = () => {
    const assetsDir = path.resolve('node_modules/@salesforce-ux/design-system/assets');
    const outputDir = path.join(__dirname, './../build/assets');
    fs.copySync(assetsDir, outputDir);
}
