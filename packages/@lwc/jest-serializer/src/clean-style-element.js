/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { getKnownScopeTokensRegex } = require('@lwc/jest-shared');

function cleanStyleElement(elm) {
    elm.textContent = elm.textContent.replace(getKnownScopeTokensRegex(), '__lwc_scope_token__');
}

module.exports = cleanStyleElement;
