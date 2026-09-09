/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// Vitest setup for LWC — port of `@lwc/jest-preset/src/setup.js` (skeleton).
// Used via `setupFiles: ['@lwc/vitest-preset/setup']`.
// TODO (order matters): lwcRuntimeFlags -> aria polyfill -> synthetic-shadow ->
// engine-dom + ENABLE_EXPERIMENTAL_SIGNALS -> expect.extend matchers -> @wire trap.
export {};
