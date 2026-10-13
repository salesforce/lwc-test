/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import data from './data/basic.json';

// JSON (e.g. wire mock data) must reach Vite's JSON loader, not the LWC compiler.
it('imports JSON files', () => {
    expect(data).toEqual({ greeting: 'hello' });
});
