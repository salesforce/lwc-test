/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Jest side of the import.meta parity check (Vitest side: importMeta.vitest.test.js).
import { readImportMeta } from '../importMeta';
import { readSSR } from '../importMetaTs';

afterEach(() => {
    delete process.env.SSR;
    delete process.env.LWC_TEST_IMPORT_META_ENV;
});

it('reads the defaults', () => {
    const values = readImportMeta();
    console.table(values);
    expect(values).toEqual({
        DEV: false,
        PROD: false,
        MODE: false,
        SSR: false,
        custom: false,
        url: undefined,
    });
});

// The transform tests every key against /true/i, so only strings containing "true" read true.
const regexResults = [
    ['true', true],
    ['TRUE', true],
    ['1', false],
    ['false', false],
    ['', false],
    ['untrue', true],
];

it.each(regexResults)('process.env.SSR = %j reads %j', (value, expected) => {
    process.env.SSR = value;
    expect(readImportMeta().SSR).toBe(expected);
});

it.each(regexResults)('process.env.LWC_TEST_IMPORT_META_ENV = %j reads %j', (value, expected) => {
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
