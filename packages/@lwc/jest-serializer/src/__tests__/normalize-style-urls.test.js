/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 */
const normalizeStyleUrlValues = require('../normalize-style-urls');

describe('normalizeStyleUrlValues', () => {
    it('strips double quotes from url() when value has no special chars (data URI)', () => {
        expect(
            normalizeStyleUrlValues('background-image: url("data:image/svg+xml;base64,abc123");')
        ).toBe('background-image: url(data:image/svg+xml;base64,abc123);');
    });

    it('strips single quotes from url() when value has no special chars', () => {
        expect(normalizeStyleUrlValues("url('https://example.com/img.png')")).toBe(
            'url(https://example.com/img.png)'
        );
    });

    it('leaves quotes when value contains space (requires quoting per CSS)', () => {
        expect(normalizeStyleUrlValues('url("path with spaces.png")')).toBe(
            'url("path with spaces.png")'
        );
    });

    it('leaves quotes when value contains double quote', () => {
        expect(normalizeStyleUrlValues('url("foo\\"bar")')).toBe('url("foo\\"bar")');
    });

    it('leaves quotes when value contains closing paren', () => {
        expect(normalizeStyleUrlValues('url("foo)bar")')).toBe('url("foo)bar")');
    });

    it('handles multiple url() in one string', () => {
        const input =
            'background: url("data:image/png;base64,A"); border-image: url(\'https://x.com/b.png\');';
        const expected =
            'background: url(data:image/png;base64,A); border-image: url(https://x.com/b.png);';
        expect(normalizeStyleUrlValues(input)).toBe(expected);
    });

    it('returns non-string unchanged', () => {
        expect(normalizeStyleUrlValues(null)).toBe(null);
        expect(normalizeStyleUrlValues(undefined)).toBe(undefined);
    });
});
