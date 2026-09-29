/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { fileURLToPath } from 'node:url';
import { salesforceScopedImports } from '@lwc/vitest-plugin';

// Vitest config factory for LWC. Call as `lwcVitestConfig(import.meta.url)` from a vitest.config.
// TODO: add the LWC compiler plugin (compile step); pin the test pool + isolation.
export function lwcVitestConfig(importMetaUrl) {
    const rootDir = fileURLToPath(new URL('.', importMetaUrl));
    return {
        root: rootDir,
        plugins: [salesforceScopedImports()],
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
