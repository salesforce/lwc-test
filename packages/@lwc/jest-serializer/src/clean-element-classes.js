/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { isKnownScopeToken } = require('@lwc/jest-shared');

function cleanElementClasses(elm) {
    for (const name of [...elm.classList]) {
        if (isKnownScopeToken(name)) {
            elm.classList.replace(name, '__lwc_scope_token__');
        }
    }
}

module.exports = cleanElementClasses;
