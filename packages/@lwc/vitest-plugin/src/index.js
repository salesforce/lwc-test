/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// Vite plugin: mocks `@salesforce/*` scoped imports for LWC unit tests (skeleton).
export function salesforceScopedImports() {
    return {
        name: '@lwc/vitest-plugin:salesforce-scoped-imports',
        // TODO: resolveId/load the @salesforce/* virtual modules per emit shape
    };
}

export default salesforceScopedImports;
