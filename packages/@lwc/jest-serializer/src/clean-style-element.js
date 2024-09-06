/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { getKnownScopeTokensRegex, hasKnownScopeTokens } = require('@lwc/jest-shared');

function cleanStyleElement(elm) {
    // Only do this replacement if we actually know about any scope tokens. Otherwise, the regex will
    // just be `(?:)` which replaces every character.
    if (hasKnownScopeTokens()) {
        elm.textContent = elm.textContent.replace(
            getKnownScopeTokensRegex(),
            '__lwc_scope_token__'
        );
    }
    elm.removeAttribute('data-rendered-by-lwc'); // irrelevant for the snapshot, added by the framework
}

module.exports = cleanStyleElement;
