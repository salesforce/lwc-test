/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const { isKnownScopeToken } = require('@lwc/jest-shared');

const ATTRS_TO_REMOVE = [
    'lwc:host', // https://github.com/salesforce/lwc/pull/1600
];

function cleanElementAttributes(elm) {
    ATTRS_TO_REMOVE.forEach((name) => {
        elm.removeAttribute(name);
    });

    // We've seen cases where elm.attributes is not iterable.
    // We could do elm.getAttributeNames() here, but we can be a bit extra cautious.
    for (const name of Element.prototype.getAttributeNames.apply(elm)) {
        if (isKnownScopeToken(name)) {
            const value = elm.getAttribute(name);
            elm.removeAttribute(name);
            elm.setAttribute('__lwc_scope_token__', value);
        }

        if (name === 'style') {
            // Normalize trivial whitespace differences (e.g. `style="  foo   bar "` becomes `style="foo bar"`
            // and `style=""` is just removed).
            const styleAttribute = elm.getAttribute(name) || '';
            const normalizedStyleAttribute = styleAttribute.replace(/\s+/g, ' ').trim();
            if (normalizedStyleAttribute) {
                elm.setAttribute(name, normalizedStyleAttribute);
            } else {
                elm.removeAttribute(name);
            }
        }
    }
}

module.exports = cleanElementAttributes;
