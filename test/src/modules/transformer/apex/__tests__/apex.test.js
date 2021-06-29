/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { ApexMethod, BarMethod, refreshApex, getSObjectValue } from '../apex';
import { ApexMethod as NotSameApexMethod } from '../otherApexConsumer';
import FooMethod from '@salesforce/apex/FooClass.FooMethod';

describe('@salesforce/apex/<class>', () => {
    it('exports a default method returning a promise', () => {
        expect(ApexMethod()).resolves.toEqual(undefined);
    });

    it('has different identities for different apex classes', () => {
        expect(ApexMethod).not.toBe(BarMethod);
    });

    it('should be the same method when imported from the same apex module', () => {
        // 2 modules consuming @salesforce/apex/FooClass.FooMethod should reference the same function.
        expect(ApexMethod).toBe(FooMethod);
    });

    it('should be a different method when imported from a different apex modules with the same resource name', () => {
        // 2 modules consuming different apex methods, via the same resource, eg:
        // Module A: import apexMethod from '@salesforce/apex/FooClass.FooMethod';
        // Module B: import apexMethod from '@salesforce/apex/BarClass.BarMethod';
        expect(ApexMethod).not.toBe(NotSameApexMethod);
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
