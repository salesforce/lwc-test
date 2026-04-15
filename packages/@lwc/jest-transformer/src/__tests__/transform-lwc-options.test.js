/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
jest.mock('@lwc/compiler/dist/index.cjs', () => ({
    transformSync: jest.fn(() => ({
        code: '/* lwc-compiled */',
        map: null,
        warnings: [],
    })),
}));

jest.mock('@babel/core', () => ({
    transform: jest.fn(() => ({ code: '/* babel */' })),
}));

jest.mock('@lwc/template-compiler/dist/index.cjs', () => ({
    generateScopeTokens: jest.fn(() => ({ cssScopeTokens: undefined })),
}));

const lwcCompiler = require('@lwc/compiler/dist/index.cjs');
const { transformLwc } = require('../index');

describe('transformLwc compiler options (namespace / enablePrivateMethods)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('sets enablePrivateMethods true when path matches modules/... (lightning)', () => {
        transformLwc('export default class {}', '/repo/modules/lightning/foo/foo.js', false);

        expect(lwcCompiler.transformSync).toHaveBeenCalledWith(
            expect.any(String),
            '/repo/modules/lightning/foo/foo.js',
            expect.objectContaining({
                namespace: 'x',
                enablePrivateMethods: true,
            })
        );
    });

    it('sets enablePrivateMethods true when path matches modules/... (interop)', () => {
        transformLwc('export default class {}', '/repo/modules/interop/bar/bar.js', false);

        expect(lwcCompiler.transformSync).toHaveBeenCalledWith(
            expect.any(String),
            '/repo/modules/interop/bar/bar.js',
            expect.objectContaining({
                namespace: 'x',
                enablePrivateMethods: true,
            })
        );
    });

    it('sets enablePrivateMethods false for other modules/... namespaces', () => {
        transformLwc('export default class {}', '/repo/modules/c/baz/baz.js', false);

        expect(lwcCompiler.transformSync).toHaveBeenCalledWith(
            expect.any(String),
            '/repo/modules/c/baz/baz.js',
            expect.objectContaining({
                namespace: 'x',
                enablePrivateMethods: false,
            })
        );
    });

    it('sets enablePrivateMethods false when path has no modules/ or jest-modules/ segment', () => {
        transformLwc('export default class {}', '/repo/src/standalone.js', false);

        expect(lwcCompiler.transformSync).toHaveBeenCalledWith(
            expect.any(String),
            '/repo/src/standalone.js',
            expect.objectContaining({
                namespace: 'x',
                enablePrivateMethods: false,
            })
        );
    });
});
