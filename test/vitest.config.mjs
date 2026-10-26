import { defineConfig } from 'vitest/config';
import { lwcVitestConfig } from '@lwc/vitest-preset';

// Integration projects: mount real components under src/modules through the LWC preset in
// both shadow modes (the Vitest parallel to the `integration` projects in jest.config.js).
function integration({ nativeShadow }) {
    const config = lwcVitestConfig(import.meta.url, { nativeShadow });
    config.test.name = `integration (${nativeShadow ? 'native' : 'synthetic'} shadow)`;
    return config;
}

export default defineConfig({
    test: {
        projects: [integration({ nativeShadow: false }), integration({ nativeShadow: true })],
    },
});
