/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * node:test in .mjs so Jest and the publish glob skip it; run: node --test <this file>.
 */

import path from 'node:path';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { lwcVitestConfig } from '../index.js';

describe('lwcVitestConfig per-file isolation', () => {
    test('pins forks + isolate by default', () => {
        const { test: config } = lwcVitestConfig(import.meta.url);
        assert.equal(config.pool, 'forks');
        assert.equal(config.isolate, true);
    });

    test('pins forks + isolate with nativeShadow', () => {
        const { test: config } = lwcVitestConfig(import.meta.url, { nativeShadow: true });
        assert.equal(config.pool, 'forks');
        assert.equal(config.isolate, true);
    });

    test('runs setup files in list order', () => {
        const { test: config } = lwcVitestConfig(import.meta.url);
        assert.equal(config.sequence.setupFiles, 'list');
    });
});

describe('lwcVitestConfig snapshot serializer', () => {
    for (const nativeShadow of [false, true]) {
        test(`registers @lwc/jest-serializer by absolute path (nativeShadow: ${nativeShadow})`, () => {
            // A bare name would be resolved from the user's root, not the preset's dependency.
            const { snapshotSerializers } = lwcVitestConfig(import.meta.url, { nativeShadow }).test;
            assert.equal(snapshotSerializers.length, 1);
            assert.ok(path.isAbsolute(snapshotSerializers[0]));
            assert.match(snapshotSerializers[0], /jest-serializer[\\/]src[\\/]index\.js$/);
        });
    }
});

describe('lwcVitestConfig moduleNameMapper', () => {
    test('runs the mapper before the @salesforce/* mocks', () => {
        // Otherwise the mocks claim a mapped @salesforce/* specifier first.
        const names = lwcVitestConfig(import.meta.url).plugins.map(({ name }) => name);
        const mapper = names.indexOf('lwc-module-name-mapper');
        assert.notEqual(mapper, -1);
        assert.ok(mapper < names.indexOf('@lwc/vitest-plugin:salesforce-scoped-imports'));
    });
});
