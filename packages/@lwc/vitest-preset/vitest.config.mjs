import { defineConfig } from 'vitest/config';
import { lwcVitestConfig } from './src/index.js';

// Exercises the preset's own config factory (smoke test).
export default defineConfig(lwcVitestConfig(import.meta.url));
