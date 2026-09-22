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

// Mock value is the specifier minus its matched prefix (e.g. `@salesforce/label/c.foo` -> `"c.foo"`).
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

function getStringValue(specifier) {
    const prefix = STRING_VALUE_PREFIXES.find((p) => specifier.startsWith(p));
    return prefix === undefined ? undefined : specifier.slice(prefix.length);
}

// user/* and client/* mock to fixed constants, not values derived from the specifier.
const USER_DEFAULTS = [
    { prefix: '@salesforce/user/Id', value: '005000000000000000' },
    { prefix: '@salesforce/user/isGuest', value: false },
];
const CLIENT_PREFIX = '@salesforce/client/';
const CLIENT_MOCK_VALUES = {
    formFactor: 'Large',
};

// Boxed in { value } so a legitimate `false` (isGuest) isn't mistaken for "no match".
function getFixedValue(specifier) {
    const userDefault = USER_DEFAULTS.find((d) => specifier.startsWith(d.prefix));
    if (userDefault !== undefined) {
        return { value: userDefault.value };
    }
    if (specifier.startsWith(CLIENT_PREFIX)) {
        const resource = specifier.slice(CLIENT_PREFIX.length);
        return { value: resource in CLIENT_MOCK_VALUES ? CLIENT_MOCK_VALUES[resource] : '' };
    }
    return null;
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

            const stringValue = getStringValue(specifier);
            if (stringValue !== undefined) {
                return `export default ${JSON.stringify(stringValue)};`;
            }

            const fixedValue = getFixedValue(specifier);
            if (fixedValue !== null) {
                return `export default ${JSON.stringify(fixedValue.value)};`;
            }

            // Fallback for shapes without a dedicated value generator yet: echo the specifier.
            return `export default ${JSON.stringify(specifier)};`;
        },
    };
}

export default salesforceScopedImports;
