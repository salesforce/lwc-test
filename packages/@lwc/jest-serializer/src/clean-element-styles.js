/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function cleanElementStyles(elm) {
    // Normalize trivial whitespace differences (e.g. `style="  foo   bar "` becomes `style="foo bar"`
    // and `style=""` is just removed).
    const styleAttribute = elm.getAttribute('style') || '';
    const normalizedStyleAttribute = styleAttribute
        // Remove leading/trailing space
        .trim()
        // Replace multiple space, tab, line break with single space
        .replace(/[\s\n\t]+/g, ' ')
        .split(';')
        // Preserve space character following a ';', style="color: blue; text-align: center"
        .map((attr) => attr.trimEnd())
        .join(';');
    if (normalizedStyleAttribute) {
        elm.setAttribute('style', normalizedStyleAttribute);
    } else {
        elm.removeAttribute('style');
    }
}

module.exports = cleanElementStyles;
