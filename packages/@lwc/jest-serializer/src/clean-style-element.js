/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { getKnownScopeTokens } = require('@lwc/jest-shared');

function cleanStyleElement(elm) {
    // attributes in the HTML namespace are case-insensitive, so we treat everything as lowercase
    const regex = new RegExp(getKnownScopeTokens().join('|'), 'gi');
    elm.textContent = elm.textContent.replace(regex, '__lwc_scope_token__');
}

module.exports = cleanStyleElement;
