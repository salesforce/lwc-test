/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const lwcResolver = require('@lwc/jest-resolver');

const ALLOWLISTED_LWC_PACKAGES = {
    lwc: '@lwc/engine-server',
};

module.exports = function (path, options) {
    if (ALLOWLISTED_LWC_PACKAGES[path]) {
        return options.defaultResolver(require.resolve(ALLOWLISTED_LWC_PACKAGES[path]), options);
    }

    return lwcResolver(path, options);
};
