/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const { isKnownScopeToken } = require('@lwc/jest-shared');

const ATTRS_TO_REMOVE = [
    'lwc:host', // https://github.com/salesforce/lwc/pull/1600
    'data-lwc-host-mutated', // https://github.com/salesforce/lwc/pull/4358
    'data-lwc-host-scope-token', // https://github.com/salesforce/lwc/pull/4865
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
    }
}

module.exports = cleanElementAttributes;
