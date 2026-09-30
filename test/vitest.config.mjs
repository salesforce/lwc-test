import { defineConfig } from 'vitest/config';
import { lwcVitestConfig } from '@lwc/vitest-preset';

// Integration project: mounts real components under src/modules through the LWC
// preset (the Vitest parallel to the `integration` project in jest.config.js).
export default defineConfig(lwcVitestConfig(import.meta.url));
