/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function cleanElementStyles(elm) {
    // Normalize trivial whitespace differences (e.g. `style="  foo   bar "` becomes `style="foo bar"`
    // and `style=""` is just removed).
    const styles = [];
    for (let i = 0; i < elm.style.length; i++) {
        const prop = elm.style[i];
        const value = elm.style.getPropertyValue(prop);
        const priority = elm.style.getPropertyPriority(prop);
        styles.push(`${prop}: ${value}${priority === 'important' ? ' !important' : ''};`);
    }

    if (styles.length) {
        elm.setAttribute('style', styles.join(' '));
    } else {
        elm.removeAttribute('style');
    }
}

module.exports = cleanElementStyles;
