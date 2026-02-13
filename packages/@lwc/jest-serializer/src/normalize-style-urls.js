/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/**
 * Characters that require the url() value to be quoted in CSS (per spec).
 * When the value contains any of these, we must not strip quotes.
 */
const URL_VALUE_REQUIRES_QUOTES = /[\s'")\\]/;

/**
 * Canonicalizes url() values in a CSS style string so that equivalent forms
 * (url(x), url("x"), url('x')) produce the same output. This fixes
 * environment-dependent serialization: jsdom/Node can output url("data:...")
 * or url(data:...) depending on version and platform; we always output
 * unquoted when the value does not require quotes per CSS rules.
 *
 * @param {string} str - A string that may contain CSS url() values (e.g. full serialized HTML or a style attribute value).
 * @returns {string} The string with url() values normalized to unquoted form where safe.
 */
function normalizeStyleUrlValues(str) {
    if (typeof str !== 'string') {
        return str;
    }
    return (
        str
            // url("...") → url(...) when inner content does not require quotes
            .replace(/url\("([^"]*)"\)/g, (_, inner) =>
                URL_VALUE_REQUIRES_QUOTES.test(inner) ? `url("${inner}")` : `url(${inner})`
            )
            // url('...') → url(...) when inner content does not require quotes
            .replace(/url\('([^']*)'\)/g, (_, inner) =>
                URL_VALUE_REQUIRES_QUOTES.test(inner) ? `url('${inner}')` : `url(${inner})`
            )
    );
}

module.exports = normalizeStyleUrlValues;
