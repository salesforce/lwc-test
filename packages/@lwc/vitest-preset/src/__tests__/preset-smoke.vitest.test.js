import { describe, it, expect } from 'vitest';

// Proves a trivial (non-LWC) test runs green through the preset config.
describe('preset smoke', () => {
    it('runs a trivial assertion', () => {
        expect(1 + 1).toBe(2);
    });

    it('provides a jsdom environment', () => {
        expect(typeof document).toBe('object');
        expect(typeof window).toBe('object');
    });
});
