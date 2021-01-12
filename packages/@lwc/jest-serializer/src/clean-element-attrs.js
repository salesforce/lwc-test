/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const GUID_ATTR_VALUE = '[shadow:guid]';
const FRAG_ID_ATTR_VALUE = `#${GUID_ATTR_VALUE}`;

// https://github.com/salesforce/lwc/blob/48e546f1d75a92ddc54febff6cecb89c3a2aafde/packages/%40lwc/template-compiler/src/parser/constants.ts#L29-L39
const ID_REFERENCING_ATTRIBUTES_SET = [
    'aria-activedescendant',
    'aria-controls',
    'aria-describedby',
    'aria-details',
    'aria-errormessage',
    'aria-flowto',
    'aria-labelledby',
    'aria-owns',
    'for',
];

const ATTRS_TO_REMOVE = [
    'lwc:host', // https://github.com/salesforce/lwc/pull/1600
];

const MANGLED_ATTRS = [...ID_REFERENCING_ATTRIBUTES_SET, 'id'];

// Attributes that can use fragment id values
const FRAG_ID_ATTRS = ['href', 'xlink:href'];

// Tag names of elements that use attributes that can use fragment id values
const FRAG_ID_TAG_NAME_SET = new Set(['a', 'area', 'use']);

function cleanElementAttributes(elm) {
    // The `use` element's tagName value is lowercase!
    const tagName = elm.tagName.toLowerCase();
    if (FRAG_ID_TAG_NAME_SET.has(tagName)) {
        FRAG_ID_ATTRS.forEach((name) => {
            const value = elm.getAttribute(name);
            if (/^#/.test(value)) {
                elm.setAttribute(name, FRAG_ID_ATTR_VALUE);
            }
        });
    }
    MANGLED_ATTRS.forEach((name) => {
        if (elm.hasAttribute(name)) {
            elm.setAttribute(name, GUID_ATTR_VALUE);
        }
    });
    ATTRS_TO_REMOVE.forEach((name) => {
        elm.removeAttribute(name);
    });
}

module.exports = cleanElementAttributes;
