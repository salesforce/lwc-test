/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function patchQuerySelector() {
    // Patch global $ and $$ to allow selection from test component shadowRoot.
    const root = 'body :last-child';

    global.$ = function(selector) {
        if (this === global) {
            return browser.$(root).shadow$(selector);
        }
        return browser.$(selector);
    };

    global.$$ = function(selector) {
        if (this === global) {
            return browser.$(root).shadow$$(selector);
        }
        return browser.$$(selector);
    };
}

module.exports = patchQuerySelector;
