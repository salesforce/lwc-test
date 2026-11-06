/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Guards the preset's moduleNameMapper option and its place before the @salesforce/* mocks.
// test/vitest.config.mjs maps @salesforce/label/mapped.* to ../labels, so a mapped label loads that
// module; other labels still get the mock's default. If the mocks ran first, they would claim the
// mapped label too and the mapping would be silently ignored.
import greeting from '@salesforce/label/mapped.greeting';
import unmapped from '@salesforce/label/c.unmapped';

describe('moduleNameMapper', () => {
    it('loads a mapped @salesforce/* import instead of the mock', () => {
        expect(greeting).toBe('Hello from the mapped module');
    });

    it('still mocks @salesforce/* imports that no key matches', () => {
        expect(unmapped).toBe('c.unmapped');
    });
});
