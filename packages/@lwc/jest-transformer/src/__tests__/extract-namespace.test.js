/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const { extractNamespace } = require('../extract-namespace');

describe('extractNamespace', () => {
    it('returns namespace from modules/{namespace}/...', () => {
        expect(extractNamespace('/repo/modules/c/foo/foo.js')).toBe('c');
    });

    it('returns namespace when path contains __tests__', () => {
        expect(extractNamespace('/repo/modules/c/foo/__tests__/foo.test.js')).toBe('c');
    });

    it('returns namespace from jest-modules/{namespace}/...', () => {
        expect(extractNamespace('/repo/jest-modules/interop/bar/bar.js')).toBe('interop');
    });

    it('normalizes Windows separators before matching', () => {
        expect(extractNamespace('C:\\repo\\modules\\lightning\\x\\x.js')).toBe('lightning');
    });

    it("returns 'x' when path does not contain modules/ or jest-modules/", () => {
        expect(extractNamespace('/repo/src/foo.js')).toBe('x');
    });

    it("returns 'x' when modules segment has no trailing segment", () => {
        expect(extractNamespace('/repo/modules')).toBe('x');
    });
});
