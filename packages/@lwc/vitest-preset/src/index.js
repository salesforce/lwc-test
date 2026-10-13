/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { fileURLToPath } from 'node:url';
import lwc from '@lwc/rollup-plugin';
import { salesforceScopedImports } from '@lwc/vitest-plugin';
import { lwcTypeScript } from './typescript.js';

// Print LWC compiler diagnostics in jest-transformer's `[LWC Warn](<file>): <message>` format;
// the plugin's own string warnings still go through Vite's logger.
function formatLwcWarnings(plugin) {
    const { transform } = plugin;
    return {
        ...plugin,
        transform(src, id) {
            const ctx = Object.create(this);
            ctx.warn = (log) => {
                if (!log?.pluginCode) {
                    return this.warn(log);
                }
                const message = log.message.replace(/^@lwc\/rollup-plugin: /, '');
                console.warn(`\x1b[33m[LWC Warn]\x1b[0m(${id.split('?')[0]}): ${message}`);
            };
            return transform.call(ctx, src, id);
        },
    };
}

// Parity with jest-preset's coveragePathIgnorePatterns. Vitest reads coverage only from the root
// config, so append to it from a hook; that also covers configs that nest this in `projects`.
const coverageExclude = ['**/*.css', '**/*.html'];
function lwcCoverageExclude() {
    return {
        name: 'lwc-coverage-exclude',
        configureVitest({ vitest }) {
            const { exclude } = vitest.config.coverage;
            exclude.push(...coverageExclude.filter((glob) => !exclude.includes(glob)));
        },
    };
}

// Vitest config factory for LWC. Call as `lwcVitestConfig(import.meta.url)` from a vitest.config.
// `nativeShadow: true` skips synthetic-shadow (Jest's `globals['lwc-jest'].nativeShadow`).
// TODO: pin the test pool + isolation.
export function lwcVitestConfig(importMetaUrl, { nativeShadow = false } = {}) {
    const rootDir = fileURLToPath(new URL('.', importMetaUrl));
    // Compiler options mirroring the jest-transformer config for parity.
    // rootDir is mandatory: buildStart crashes without it under Vitest (no rollup input).
    // Known gap: Jest hardcodes namespace 'x'/name 'test'; the plugin derives them from the path
    // (no override), so `sel` and CSS scope tokens differ (x-test vs e.g. smoke-mixin).
    const compilerOptions = {
        rootDir,
        sourcemap: true,
        dynamicImports: { strictSpecifier: false },
        enableDynamicComponents: true,
        enableLwcOn: true,
    };
    const testExclude = ['**/node_modules/**', '**/*.test.js', '**/*.vitest.test.js'];
    // enablePrivateMethods is per-namespace in Jest (lightning/interop only), but the plugin
    // exposes only a global flag, so split compilation into two path-scoped instances.
    const privateMethodsNamespaces = /[\\/](?:modules|jest-modules)[\\/](?:lightning|interop)[\\/]/;
    return {
        root: rootDir,
        // Vite's built-in transform (Oxc in Vite 8) lowers LWC decorators on .ts;
        // lwcTypeScript() handles type-stripping instead, so keep it off.
        oxc: false,
        plugins: [
            lwcCoverageExclude(),
            salesforceScopedImports(),
            lwcTypeScript(),
            // Compile .js/.html/.css LWC bundles (replaces @lwc/jest-transformer's compile job).
            formatLwcWarnings(
                lwc({
                    ...compilerOptions,
                    include: [privateMethodsNamespaces],
                    exclude: testExclude,
                    enablePrivateMethods: true,
                })
            ),
            formatLwcWarnings(
                lwc({
                    ...compilerOptions,
                    exclude: [...testExclude, privateMethodsNamespaces],
                    enablePrivateMethods: false,
                })
            ),
        ],
        // Resolve bare `lwc` to the engine (parity with @lwc/jest-resolver), via the @wire trap.
        resolve: { alias: { lwc: fileURLToPath(new URL('./lwc.js', import.meta.url)) } },
        test: {
            environment: 'jsdom',
            // Match Jest's jsdom URL (Vitest defaults to http://localhost:3000).
            environmentOptions: { jsdom: { url: 'http://localhost/' } },
            // Read by setup.js via inject().
            provide: { lwcNativeShadow: nativeShadow },
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
