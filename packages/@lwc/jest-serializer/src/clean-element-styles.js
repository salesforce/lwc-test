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
        .replace(/\s+/g, ' ')
        .split(';')
        .map((_) => `${_.trim()};`)
        .filter((_) => _ !== ';')
        // Normalize whitespace around colons, e.g. `color :  red` -> `color: red`
        .map((declaration) =>
            declaration
                .split(':')
                // remove whitespace before `important`, e.g. `! important` -> `!important`
                .map((_) => _.trim().replace(/!\simportant/, '!important'))
                .join(': '),
        )
        .join(' ');
    if (normalizedStyleAttribute) {
        elm.setAttribute('style', normalizedStyleAttribute);
    } else {
        elm.removeAttribute('style');
    }
}

module.exports = cleanElementStyles;
