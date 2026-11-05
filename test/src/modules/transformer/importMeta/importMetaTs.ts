/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// Keep this basename distinct from importMeta.js: Jest resolves '../importMeta' to .ts first,
// Vite to .js first.
export function readSSR(): boolean {
    return import.meta.env.SSR;
}
