/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

it('returns the module record for default only modules', async () => {
    const res = await import('../default-only');
    expect(res).toEqual({
        default: 'default value',
    });
});

it('returns the module record for named only modules', async () => {
    const res = await import('../named-only');
    expect(res).toEqual({
        named: 'named value',
    });
});

it('returns the module record for mixed modules', async () => {
    const res = await import('../mixed');
    expect(res).toEqual({
        default: 'default value',
        named: 'named value',
    });
});
