describe('smoke private methods (smoke-private-methods)', () => {
    // A top-level `import '../privateMethods'` runs before tests; Jest transforms that file with
    // `enablePrivateMethods: false` for smoke namespace, so compilation throws
    it('fails to compile: # private methods need enablePrivateMethods (only lightning/interop paths)', () => {
        jest.resetModules();
        expect(() => {
            require('../privateMethods');
        }).toThrow(/LWC1007:[\s\S]*Class private methods are not enabled/);
    });
});
