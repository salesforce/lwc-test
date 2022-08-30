/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import semver from 'semver';
import { version as jestVersion } from 'jest/package.json';

describe('should return the expected state', () => {
    it('undefined', () => {
        expect(undefined).toMatchInlineSnapshot('undefined');
    });
    it('null', () => {
        expect(null).toMatchInlineSnapshot('', `null`);
    });
    it('empty object', () => {
        expect({}).toMatchInlineSnapshot('', `{}`);
    });
    it('without the nodeType property', () => {
        expect({ anotherKindOfProperty: 5 }).toMatchInlineSnapshot(
            '',
            `
            {
              "anotherKindOfProperty": 5,
            }
        `
        );
    });
    it('with an element node type', () => {
        expect(document.createElement('div')).toMatchInlineSnapshot('', `<div />`);
    });
    it('with a text node type', () => {
        expect(document.createTextNode('')).toMatchInlineSnapshot('');
    });
    it('with a comment node type', () => {
        expect(document.createComment('')).toMatchInlineSnapshot('', `<!---->`);
    });
    it('with another kind of node type', () => {
        expect(document.createAttribute('foo')).toMatchInlineSnapshot('', `Attr {}`);
    });
});
