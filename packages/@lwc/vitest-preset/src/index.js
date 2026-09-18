/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { fileURLToPath } from 'node:url';
import { salesforceScopedImports } from '@lwc/vitest-plugin';

// Vitest config factory for LWC (skeleton). Call as `lwcVitestConfig(import.meta.url)`.
export function lwcVitestConfig(importMetaUrl) {
    const rootDir = fileURLToPath(new URL('.', importMetaUrl));
    return {
        root: rootDir,
        // TODO: add @lwc/rollup-plugin (compile) to plugins
        plugins: [salesforceScopedImports()],
        test: {
            environment: 'jsdom',
            server: {
                deps: {
                    // Force @salesforce/*+@label/ through Vite so the mock plugin's hooks run
                    // (esbuild pre-bundling bypasses them). UNVERIFIED until vitest/vite installed.
                    inline: [/^@salesforce\//, /^@label\//],
                },
            },
            // TODO: setupFiles, snapshotSerializers, resolve.alias, pool 'forks' + isolate
        },
    };
}

export default lwcVitestConfig;
