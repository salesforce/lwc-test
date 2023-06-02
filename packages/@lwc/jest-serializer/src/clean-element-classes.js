/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { isKnownScopeToken } = require('@lwc/jest-shared');

function cleanElementClasses(elm) {
    for (const name of [...elm.classList]) {
        // LWC may add '-host' to the end in some cases
        if (isKnownScopeToken(name) || isKnownScopeToken(name.replace(/-host$/, ''))) {
            elm.classList.remove(name)
        }
    }
}

module.exports = cleanElementClasses;
