/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function cleanElementClasses(elm) {
    const shadowToken = elm.$shadowToken$
    if (shadowToken) {
        elm.classList.remove(shadowToken)
        elm.classList.remove(`${shadowToken}-host`)
    }
}

module.exports = cleanElementClasses;
