/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { ApexMethod, BarMethod, refreshApex, getSObjectValue } from '../apex';

describe('@salesforce/apex/<class>', () => {
    it('exports a default method returning a promise', () => {
        expect(ApexMethod()).resolves.toEqual(undefined);
    });

    it('has different identities for different apex classes', () => {
        expect(ApexMethod).not.toBe(BarMethod);
    });
});

describe('@salesforce/apex', () => {
    it('exports refreshApex method returning a promise', () => {
        expect(refreshApex()).resolves.toEqual(undefined);
    });

    it('exports getSObjectValue method returning a jest.fn()', () => {
        expect(getSObjectValue).not.toBeCalled();

        getSObjectValue('foo');
        expect(getSObjectValue).toBeCalledWith('foo');
    });
});
