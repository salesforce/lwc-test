/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * node:test in .mjs so Jest and the publish glob skip it; run: node --test <this file>.
 */

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
