import { defineConfig } from 'vitest/config';
import { lwcVitestConfig } from './src/index.js';

// Exercises the preset's own config factory (B1 smoke test).
export default defineConfig(lwcVitestConfig(import.meta.url));
