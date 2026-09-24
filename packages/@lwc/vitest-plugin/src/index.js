/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// Vite plugin: mocks `@salesforce/*` + `@label/` scoped imports for LWC unit tests.
const SCOPED_IMPORT_PREFIXES = [
    '@salesforce/accessCheck/',
    '@salesforce/apex', // also claims @salesforce/apexContinuation by prefix
    '@salesforce/client/',
    '@salesforce/contentAssetUrl/',
    '@salesforce/customPermission/',
    '@salesforce/i18n/',
    '@salesforce/label/',
    '@label/',
    '@salesforce/messageChannel/',
    '@salesforce/resourceUrl/',
    '@salesforce/schema',
    '@salesforce/site/',
    '@salesforce/user/Id',
    '@salesforce/user/isGuest',
    '@salesforce/userPermission/',
];

// Rollup treats ids beginning with '\0' as virtual, so no other plugin loads them from disk.
const VIRTUAL_PREFIX = '\0salesforce:';

function isMockedSpecifier(source) {
    return SCOPED_IMPORT_PREFIXES.some((prefix) => source.startsWith(prefix));
}

// Apex default-method imports (plain + continuation). Both are a callable returning a promise, so
// they share one fake — Jest mocks them identically. Trailing slash excludes bare `@salesforce/apex`
// named imports (their own story).
const APEX_METHOD_PREFIXES = ['@salesforce/apex/', '@salesforce/apexContinuation/'];

// Callable spy returning a promise, so both @wire and imperative calls work. Vite caches the
// virtual module per specifier, so all importers share one spy.
const APEX_METHOD_SOURCE = `import { vi } from 'vitest';\nexport default vi.fn(() => Promise.resolve());`;

export function salesforceScopedImports() {
    return {
        name: '@lwc/vitest-plugin:salesforce-scoped-imports',
        // Claim the specifier before Vite core resolution and before @lwc/rollup-plugin.
        enforce: 'pre',
        resolveId(source) {
            return isMockedSpecifier(source) ? VIRTUAL_PREFIX + source : null;
        },
        load(id) {
            if (!id.startsWith(VIRTUAL_PREFIX)) {
                return null;
            }
            const specifier = id.slice(VIRTUAL_PREFIX.length);
            if (APEX_METHOD_PREFIXES.some((prefix) => specifier.startsWith(prefix))) {
                return APEX_METHOD_SOURCE;
            }
            // Placeholder default export for unmigrated prefixes.
            return `export default ${JSON.stringify(specifier)};`;
        },
    };
}

export default salesforceScopedImports;
