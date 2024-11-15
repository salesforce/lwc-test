/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const { getKnownScopeTokensRegex } = require('@lwc/jest-shared');

const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';

// Void elements are elements that self-close even without an explicit solidus (slash),
// e.g. `</tagName>` or `<tagName />`. For instance, `<meta>` closes on its own; no need for a slash.
// These only come from HTML; there are no void elements in the SVG or MathML namespaces.
// See: https://html.spec.whatwg.org/multipage/syntax.html#syntax-tags
const VOID_ELEMENTS_SET = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'source',
    'track',
    'wbr',
]);

function isVoidElement(name, namespace) {
    return namespace === HTML_NAMESPACE && VOID_ELEMENTS_SET.has(name.toLowerCase());
}

// Note: Original code lives here: https://github.com/salesforce/lwc/blob/master/packages/%40lwc/engine-server/src/__tests__/fixtures.spec.ts#L54-L117
/**
 * Naive HTML fragment formatter.
 *
 * This is a replacement for Prettier HTML formatting. Prettier formatting is too aggressive for
 * fixture testing. It not only indent the HTML code but also fixes HTML issues. For testing we want
 * to make sure that the fixture file is as close as possible to what the engine produces.
 *
 * @param src the original HTML fragment.
 * @returns the formatter HTML fragment.
 */
function formatHTML(src) {
    // Replace all ZWJ characters _before_ doing any other text processing, because otherwise we will add unnecessary
    // whitespace and newlines. LWC uses the ZWJ character as a special character to represent empty text nodes.
    // See: https://github.com/salesforce/lwc/pull/2656
    src = src.replace(/\u200D/g, '');

    let res = '';
    let pos = 0;
    let start = pos;

    let depth = 0;

    const getPadding = () => {
        return '  '.repeat(depth);
    };

    while (pos < src.length) {
        // Consume element tags and comments.
        if (src.charAt(pos) === '<') {
            const tagNameMatch = src.slice(pos).match(/(\w+)/);

            const isVoid = isVoidElement(tagNameMatch[0], HTML_NAMESPACE);
            const isClosing = src.charAt(pos + 1) === '/';
            const isComment =
                src.charAt(pos + 1) === '!' &&
                src.charAt(pos + 2) === '-' &&
                src.charAt(pos + 3) === '-';

            start = pos;
            while (src.charAt(pos++) !== '>') {
                // Keep advancing until the closing tag.
            }

            // Adjust current depth and print the element tag or comment.
            if (isClosing) {
                depth--;
            }

            res += getPadding() + src.slice(start, pos) + '\n';

            const isSelfClosing = src.charAt(pos - 2) === '/';
            if (!isClosing && !isSelfClosing && !isVoid && !isComment) {
                depth++;
            }
        }

        // Consume text content.
        start = pos;
        while (src.charAt(pos) !== '<' && pos < src.length) {
            pos++;
        }

        if (start !== pos) {
            res += getPadding() + src.slice(start, pos) + '\n';
        }
    }

    return (
        res
            .trim()
            .replace(getKnownScopeTokensRegex(), '__lwc_scope_token__')
            // These special attributes are reserved by the framework and are meaningless to component authors.
            // `data-lwc-host-mutated` may or may not have an attribute value depending on the version of LWC.
            // See: https://github.com/salesforce/lwc/pull/4385
            .replace(/ data-lwc-host-mutated(="[^"]*")?/g, '')
            .replace(/ data-lwc-host-scope-token(="[^"]*")?/g, '')
            .replace(/ data-rendered-by-lwc/g, '')
    );
}

module.exports = {
    test(val) {
        return typeof val === 'string' && val.length > 0;
    },
    serialize: formatHTML,
};
