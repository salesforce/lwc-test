const { extractNamespace } = require('../extract-namespace');

describe('extractNamespace', () => {
    it("always returns 'x'", () => {
        expect(extractNamespace('/repo/src/foo.js')).toBe('x');
        expect(extractNamespace('/modules/x/foo/bar.js')).toBe('x');
        expect(extractNamespace('/modules/x/foo/bar/baz.js')).toBe('x');
    });

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

    it('extracts namespace from absolute paths', () => {
        expect(extractNamespace('/var/project/modules/lightning/button/button.js')).toBe(
            'lightning'
        );
        expect(extractNamespace('/repo/nested/jest-modules/interop/cmp/cmp.js')).toBe('interop');
    });

    it('extracts namespace from relative paths', () => {
        expect(extractNamespace('project/modules/smoke/widget/widget.js')).toBe('smoke');
        expect(extractNamespace('modules/c/foo/foo.js')).toBe('c');
        expect(extractNamespace('./src/jest-modules/interop/x/x.js')).toBe('interop');
        expect(extractNamespace('packages/pkg/modules/custom/lib/lib.js')).toBe('custom');
    });

    it("returns 'x' when path does not contain modules/ or jest-modules/", () => {
        expect(extractNamespace('/repo/src/foo.js')).toBe('x');
    });

    it("returns 'x' when modules segment has no trailing segment", () => {
        expect(extractNamespace('/repo/modules')).toBe('x');
    });
});
