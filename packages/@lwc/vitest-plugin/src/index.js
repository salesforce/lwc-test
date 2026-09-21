/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// Vite plugin: mocks `@salesforce/*` + `@label/` scoped imports for LWC unit tests.
// Prefixes mirror the wired Jest transforms' import identifiers (jest-transformer/src/transforms/*) — keep in sync.
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

// A3 — "prefix-stripped string" family: mock value is the specifier minus its matched prefix
// (e.g. `@salesforce/label/c.foo` -> `"c.foo"`). Ports jest-transformer's stringScopedImportTransform.
const STRING_VALUE_PREFIXES = [
    '@salesforce/label/',
    '@label/', // legacy alias for @salesforce/label/
    '@salesforce/resourceUrl/',
    '@salesforce/contentAssetUrl/',
    '@salesforce/messageChannel/',
    '@salesforce/userPermission/',
    '@salesforce/customPermission/',
    '@salesforce/accessCheck/',
];

// Returns the mock string, or undefined when the specifier belongs to another shape (later stories).
function getStringValue(specifier) {
    const prefix = STRING_VALUE_PREFIXES.find((p) => specifier.startsWith(p));
    return prefix === undefined ? undefined : specifier.slice(prefix.length);
}

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

            // A3 — prefix-stripped string family.
            const stringValue = getStringValue(specifier);
            if (stringValue !== undefined) {
                return `export default ${JSON.stringify(stringValue)};`;
            }

            // Placeholder default export; the remaining value generators land in later stories (A4–A10).
            return `export default ${JSON.stringify(specifier)};`;
        },
    };
}

export default salesforceScopedImports;
