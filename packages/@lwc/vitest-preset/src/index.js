/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { fileURLToPath } from 'node:url';
import lwc from '@lwc/rollup-plugin';
import { salesforceScopedImports } from '@lwc/vitest-plugin';

// Vitest config factory for LWC. Call as `lwcVitestConfig(import.meta.url)` from a vitest.config.
// TODO: pin the test pool + isolation.
export function lwcVitestConfig(importMetaUrl) {
    const rootDir = fileURLToPath(new URL('.', importMetaUrl));
    return {
        root: rootDir,
        plugins: [
            salesforceScopedImports(),
            // Compile .js/.html/.css LWC bundles (replaces @lwc/jest-transformer's compile job).
            // rootDir is mandatory: buildStart crashes without it under Vitest (no rollup input).
            lwc({
                rootDir,
                exclude: ['**/node_modules/**', '**/*.test.js', '**/*.vitest.test.js'],
            }),
        ],
        // Resolve bare `lwc` to the engine (parity with @lwc/jest-resolver).
        resolve: { alias: { lwc: '@lwc/engine-dom' } },
        test: {
            environment: 'jsdom',
            globals: true,
            include: ['**/__tests__/**/*.vitest.test.{js,ts}'],
            setupFiles: ['@lwc/vitest-preset/setup'],
            // Setup order is load-bearing (flags -> polyfill -> synthetic-shadow -> engine); run in order.
            sequence: { setupFiles: 'list' },
            // TODO: confirm both keys below are needed (inline + web optimizer off); drop the redundant one and this note.
            server: {
                deps: {
                    // Force @salesforce/*+@label/ through Vite so the mock plugin's hooks run.
                    inline: [/^@salesforce\//, /^@label\//],
                },
            },
            // Disable the web deps optimizer so esbuild pre-bundling never bypasses our plugins.
            deps: { optimizer: { web: { enabled: false } } },
        },
    };
}

export default lwcVitestConfig;
