/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { ApexMethod, refreshApex, getSObjectValue } from '../apex';

describe('@salesforce/apex/<class>', () => {
    it('exports a default method returning a promise', async () => {
        expect(ApexMethod).not.toHaveBeenCalled();

        ApexMethod.mockResolvedValue('bar');
        const result = await ApexMethod('foo');
        expect(ApexMethod).toHaveBeenCalledWith('foo');
        expect(result).toBe('bar');
    });
});

describe('@salesforce/apex', () => {
    it('exports refreshApex method returning a promise', () => {
        expect(refreshApex()).resolves.toEqual(undefined);
    });

    it('exports getSObjectValue method returning a jest.fn()', () => {
        expect(getSObjectValue).not.toHaveBeenCalled();

        getSObjectValue('foo');
        expect(getSObjectValue).toHaveBeenCalledWith('foo');
    });
});
