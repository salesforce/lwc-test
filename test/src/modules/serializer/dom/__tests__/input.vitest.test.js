/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// Vitest prints objects in Jest 29+'s format, so only input.spec.js's >= 29 branch applies.
describe('should return the expected state', () => {
    it('undefined', () => {
        const input = undefined;
        expect(input).toMatchInlineSnapshot('undefined');
    });
    it('null', () => {
        const input = null;
        expect(input).toMatchInlineSnapshot(`null`);
    });
    it('empty object', () => {
        const input = {};
        expect(input).toMatchInlineSnapshot(`{}`);
    });
    it('without the nodeType property', () => {
        const input = { anotherKindOfProperty: 5 };
        expect(input).toMatchInlineSnapshot(`
                            {
                              "anotherKindOfProperty": 5,
                            }
                    `);
    });
    it('with an element node type', () => {
        const input = document.createElement('div');
        expect(input).toMatchInlineSnapshot(`<div />`);
    });
    it('with a text node type', () => {
        const input = document.createTextNode('');
        expect(input).toMatchInlineSnapshot('');
    });
    it('with a comment node type', () => {
        const input = document.createComment('');
        expect(input).toMatchInlineSnapshot(`<!---->`);
    });
    it('with another kind of node type', () => {
        const input = document.createAttribute('foo');
        expect(input).toMatchInlineSnapshot(`Attr {}`);
    });
});
