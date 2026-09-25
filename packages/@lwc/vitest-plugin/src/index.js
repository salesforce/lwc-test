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

const I18N_IMPORT_PREFIX = '@salesforce/i18n/';

// Ported from the Jest i18n transform's getMockValue -- keep in sync.
function mappedI18nValue(key) {
    const parts = key.split('.');
    switch (parts[0]) {
        case 'lang':
            return 'en';
        case 'dir':
            return 'ltr';
        case 'locale':
            return 'en-US';
        case 'timeZone':
            return 'America/Los_Angeles';
        case 'currency':
            return 'USD';
        case 'firstDayOfWeek':
            return 0;
        case 'dateTime':
            switch (parts[1]) {
                case 'shortDateFormat':
                    return 'M/d/yyyy';
                case 'mediumDateFormat':
                    return 'MMM d, yyyy';
                case 'longDateFormat':
                    return 'MMMM d, yyyy';
                case 'shortDateTimeFormat':
                    return 'M/d/yyyy h:mm a';
                case 'mediumDateTimeFormat':
                    return 'MMM d, yyyy h:mm:ss a';
                case 'shortTimeFormat':
                    return 'h:mm a';
                case 'mediumTimeFormat':
                    return 'h:mm:ss a';
                default:
                    return undefined;
            }
        case 'number':
            switch (parts[1]) {
                case 'numberFormat':
                    return '#,##0.###';
                case 'percentFormat':
                    return '#,##0%';
                case 'currencyFormat':
                    return '¤#,##0.00;(¤#,##0.00)';
                case 'currencySymbol':
                    return '$';
                default:
                    return undefined;
            }
        default:
            return undefined;
    }
}

// Mapped key -> its value; any other key -> ''
function getI18nValue(specifier) {
    const key = specifier.slice(I18N_IMPORT_PREFIX.length);
    const mapped = mappedI18nValue(key);
    return mapped === undefined ? '' : mapped;
}

const SCHEMA_IMPORT_PREFIX = '@salesforce/schema';

function getSchemaValue(specifier) {
    const resourcePath = specifier.slice(SCHEMA_IMPORT_PREFIX.length + 1);
    const idx = resourcePath.indexOf('.');
    if (idx === -1) {
        return { objectApiName: resourcePath };
    }
    return {
        objectApiName: resourcePath.slice(0, idx),
        fieldApiName: resourcePath.slice(idx + 1),
    };
}

// Narrow claim: only known keys are mocked; unknown @salesforce/site/* pass through to real resolution.
const SITE_PREFIX = '@salesforce/site/';
const SITE_VALUES = {
    Id: '005000000000000000',
    activeLanguages: [{ code: 'en-US', label: 'English (US)' }],
    defaultLanguages: { code: 'en-US', label: 'English (US)' },
};

function getSiteValue(specifier) {
    if (!specifier.startsWith(SITE_PREFIX)) {
        return undefined;
    }
    const key = specifier.slice(SITE_PREFIX.length);
    return Object.hasOwn(SITE_VALUES, key) ? SITE_VALUES[key] : undefined;
}

export function salesforceScopedImports() {
    return {
        name: '@lwc/vitest-plugin:salesforce-scoped-imports',
        // Run before Vite's core `vite:resolve` so the mock wins even when the specifier also resolves to a real file on disk.
        enforce: 'pre',
        resolveId(source) {
            const claimed = getSiteValue(source) !== undefined || isMockedSpecifier(source);
            return claimed ? VIRTUAL_PREFIX + source : null;
        },
        load(id) {
            if (!id.startsWith(VIRTUAL_PREFIX)) {
                return null;
            }
            const specifier = id.slice(VIRTUAL_PREFIX.length);
            if (APEX_METHOD_PREFIXES.some((prefix) => specifier.startsWith(prefix))) {
                return APEX_METHOD_SOURCE;
            }

            const stringValue = getStringValue(specifier);
            if (stringValue !== undefined) {
                return `export default ${JSON.stringify(stringValue)};`;
            }

            const fixedValue = getFixedValue(specifier);
            if (fixedValue !== null) {
                return `export default ${JSON.stringify(fixedValue.value)};`;
            }

            if (specifier.startsWith(I18N_IMPORT_PREFIX)) {
                return `export default ${JSON.stringify(getI18nValue(specifier))};`;
            }

            if (specifier.startsWith(SCHEMA_IMPORT_PREFIX)) {
                return `export default ${JSON.stringify(getSchemaValue(specifier))};`;
            }

            const siteValue = getSiteValue(specifier);
            if (siteValue !== undefined) {
                return `export default ${JSON.stringify(siteValue)};`;
            }

            // Fallback for shapes without a dedicated value generator yet: echo the specifier.
            return `export default ${JSON.stringify(specifier)};`;
        },
    };
}

export default salesforceScopedImports;
