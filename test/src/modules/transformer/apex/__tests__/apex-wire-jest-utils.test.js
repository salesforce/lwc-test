/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { ApexMethod, BarMethod } from '../apex';

jest.mock(
    '@salesforce/wire-service-jest-util',
    () => {
        return {
            createApexTestWireAdapter: (fn) => {
                fn.adapter = true;

                return fn;
            },
        };
    },
    { virtual: true }
);

describe('@salesforce/apex/<class> when used with @salesforce/wire-service-jest-util', () => {
    it('has different identities for different apex classes', () => {
        expect(ApexMethod).not.toBe(BarMethod);
    });

    it('called createApexTestWireAdapter from @salesforce/wire-service-jest-util', () => {
        expect(ApexMethod.adapter).toBe(true);
    });

    it('passes a jest.fn() to createApexTestWireAdapter', () => {
        expect(ApexMethod.mock.calls).toHaveLength(0);
        ApexMethod();
        expect(ApexMethod.mock.calls).toHaveLength(1);
    });

    it('it has resolved promise as default implementation', () => {
        return ApexMethod().then(() => expect(true).toBe(true));
    });
});

