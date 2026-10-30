/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Vitest side of the import.meta parity check (Jest side: importMeta.test.js).
import { vi } from 'vitest';
import { readImportMeta } from '../importMeta';
import { readSSR } from '../importMetaTs';

afterEach(() => {
    vi.unstubAllEnvs();
    delete process.env.SSR;
    delete process.env.LWC_TEST_IMPORT_META_ENV;
});

it('reads the defaults', () => {
    const values = readImportMeta();
    console.table(values);
    expect(values).toEqual({
        DEV: true,
        PROD: false,
        MODE: 'test',
        SSR: false,
        custom: undefined,
        url: expect.stringMatching(/^file:\/\/.*\/importMeta\.js$/),
    });
});

// SSR is !!process.env.SSR, so any non-empty string reads true, including '1' and 'false'.
it.each([
    ['true', true],
    ['TRUE', true],
    ['1', true],
    ['false', true],
    ['', false],
    ['untrue', true],
])('process.env.SSR = %j reads %j', (value, expected) => {
    process.env.SSR = value;
    expect(readImportMeta().SSR).toBe(expected);
});

// Keys other than DEV, PROD and SSR come through as the raw string.
it.each([
    ['true', 'true'],
    ['TRUE', 'TRUE'],
    ['1', '1'],
    ['false', 'false'],
    ['', ''],
    ['untrue', 'untrue'],
])('process.env.LWC_TEST_IMPORT_META_ENV = %j reads %j', (value, expected) => {
    process.env.LWC_TEST_IMPORT_META_ENV = value;
    expect(readImportMeta().custom).toBe(expected);
});

it('flips SSR with a string and delete', () => {
    process.env.SSR = 'true';
    expect(readImportMeta().SSR).toBe(true);
    expect(readSSR()).toBe(true);

    delete process.env.SSR;
    expect(readImportMeta().SSR).toBe(false);
    expect(readSSR()).toBe(false);
});

it('flips SSR with vi.stubEnv', () => {
    vi.stubEnv('SSR', true);
    expect(readSSR()).toBe(true);

    vi.unstubAllEnvs();
    expect(readSSR()).toBe(false);
});
