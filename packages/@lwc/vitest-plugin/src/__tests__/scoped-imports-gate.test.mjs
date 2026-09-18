/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * A2 gate test: plugin claims mocked @salesforce/*+@label/ specifiers, passes through the rest.
 * Interim node:test (.mjs hides it from Jest + publish glob); run: node --test <this file>.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { salesforceScopedImports, default as defaultExport } from '../index.js';

const VIRTUAL_PREFIX = '\0salesforce:';
const plugin = salesforceScopedImports();

// One representative specifier per mocked type + the tricky edges.
const MOCKED = [
    '@salesforce/accessCheck/record.Account',
    '@salesforce/apex/MyClass.method',
    '@salesforce/apexContinuation/x', // subsumed by the '@salesforce/apex' prefix
    '@salesforce/client/formFactor',
    '@salesforce/contentAssetUrl/foo',
    '@salesforce/customPermission/foo',
    '@salesforce/i18n/lang',
    '@salesforce/label/c.greeting',
    '@label/c.greeting', // legacy prefix
    '@salesforce/messageChannel/foo__c',
    '@salesforce/resourceUrl/foo',
    '@salesforce/schema', // exact, no trailing slash
    '@salesforce/schema/Account.Name',
    '@salesforce/site/Id',
    '@salesforce/user/Id',
    '@salesforce/user/isGuest',
    '@salesforce/userPermission/foo',
];

// Must PASS THROUGH — real npm packages or non-mocked @salesforce/* paths.
const PASSTHROUGH = [
    '@salesforce/wire-service-jest-util',
    '@salesforce/pwa-kit-dev',
    '@salesforce/eslint-plugin-lwc',
    '@salesforce/user/somethingElse', // only /Id and /isGuest are mocked
    '@salesforce/label', // bare: the LABEL prefix requires a trailing slash
    'lwc',
    './relative-module',
    'react',
];

// apex/schema have no trailing slash, so (like Jest's startsWith) they claim siblings too.
// Intentional Jest-parity — don't tighten these or the runners diverge.
const LOOSE_PREFIX_CLAIMED = ['@salesforce/apexFoo', '@salesforce/schemaOther'];

test('plugin shape', () => {
    assert.equal(defaultExport, salesforceScopedImports, 'default export is the factory');
    assert.equal(plugin.name, '@lwc/vitest-plugin:salesforce-scoped-imports');
    // Claim the specifier before Vite core resolution / the esbuild optimizer.
    assert.equal(plugin.enforce, 'pre');
    assert.equal(typeof plugin.resolveId, 'function');
    assert.equal(typeof plugin.load, 'function');
});

test('resolveId claims every mocked specifier as a virtual id', () => {
    for (const spec of MOCKED) {
        assert.equal(plugin.resolveId(spec), VIRTUAL_PREFIX + spec, `should claim ${spec}`);
    }
});

test('resolveId passes through everything else (the A2 over-claim fix)', () => {
    for (const spec of PASSTHROUGH) {
        assert.equal(plugin.resolveId(spec), null, `should NOT claim ${spec}`);
    }
});

test('loose apex/schema prefixes claim sibling specifiers by design (mirrors Jest)', () => {
    for (const spec of LOOSE_PREFIX_CLAIMED) {
        assert.equal(
            plugin.resolveId(spec),
            VIRTUAL_PREFIX + spec,
            `loose prefix should claim ${spec}`
        );
    }
});

test('load serves claimed virtual ids and ignores everything else', () => {
    // A claimed id loads to a module (placeholder value until A3–A10 land).
    const virtualId = VIRTUAL_PREFIX + '@salesforce/label/c.greeting';
    assert.equal(plugin.load(virtualId), 'export default "@salesforce/label/c.greeting";');
    // Non-virtual ids are not ours -> null, so other plugins/Vite load them.
    assert.equal(plugin.load('@salesforce/label/c.greeting'), null);
    assert.equal(plugin.load('some-real-module'), null);
    assert.equal(plugin.load('\0other-plugin:foo'), null);
});
