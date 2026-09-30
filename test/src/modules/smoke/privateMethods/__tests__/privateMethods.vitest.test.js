// Private methods are only enabled for the lightning/interop namespaces; a smoke-namespace
// component using them must fail to compile (LWC1007), mirroring the Jest test.
describe('smoke private methods (smoke-private-methods)', () => {
    it('fails to compile: # private methods need enablePrivateMethods (only lightning/interop paths)', async () => {
        await expect(import('../privateMethods')).rejects.toThrow(
            /LWC1007[\s\S]*private methods are not enabled/
        );
    });
});
