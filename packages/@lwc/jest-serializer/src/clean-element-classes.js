/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { isKnownScopeToken } = require('@lwc/jest-shared');

function cleanElementClasses(elm) {
    // Replace LWC scope token classes with a consistent placeholder
    for (const name of [...elm.classList]) {
        if (isKnownScopeToken(name)) {
            elm.classList.replace(name, '__lwc_scope_token__');
        }
    }
    // Normalize trivial whitespace differences (e.g. `class="  foo   bar "` becomes `class="foo bar"`
    // and `class=""` is just removed).
    const className = elm.getAttribute('class') || '';
    const normalizedClassName = className.replace(/\s+/g, ' ').trim();
    if (normalizedClassName) {
        elm.setAttribute('class', normalizedClassName);
    } else {
        elm.removeAttribute('class');
    }
}

module.exports = cleanElementClasses;
