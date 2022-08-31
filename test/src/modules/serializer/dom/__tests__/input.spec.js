/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import semver from 'semver';
import { version as jestVersion } from 'jest/package.json';

const jestMajorVersion = semver.major(jestVersion);

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
        if (jestMajorVersion >= 29) { // Jest changed its snapshot format in v29
            expect(input).toMatchInlineSnapshot(`{}`);
        } else {
            expect(input).toMatchInlineSnapshot(`Object {}`);
        }
    });
    it('without the nodeType property', () => {
        const input = { anotherKindOfProperty: 5 };
        if (jestMajorVersion >= 29) { // Jest changed its snapshot format in v29
            expect(input).toMatchInlineSnapshot(`
                            {
                              "anotherKindOfProperty": 5,
                            }
                    `
            );
        } else {
            expect(input).toMatchInlineSnapshot(`
                Object {
                  "anotherKindOfProperty": 5,
                }
            `);
        }
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
