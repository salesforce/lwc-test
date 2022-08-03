/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const lwcResolver = require('@lwc/jest-resolver');

const WHITELISTED_LWC_PACKAGES = {
    lwc: '@lwc/engine-server',
};

function getLwcPath(path) {
    if (WHITELISTED_LWC_PACKAGES[path]) {
        return require.resolve(WHITELISTED_LWC_PACKAGES[path]);
    }

    return path;
}

module.exports = function (path, options) {
    return lwcResolver(getLwcPath(path, options), options);
};
