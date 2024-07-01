/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { ApexMethod, refreshApex, getSObjectValue } from '../apex';

describe('@salesforce/apex/<class>', () => {
    it('exports a default method returning a promise', () => {
        expect(ApexMethod()).resolves.toEqual(undefined);
    });
});

describe('@salesforce/apex', () => {
    it('exports refreshApex method returning a promise', () => {
        expect(refreshApex()).not.toBeUndefined();
        expect(refreshApex().then).toEqual(expect.any(Function)); // should be a thenable (promise)
        expect(refreshApex()).resolves.toEqual(undefined); // should resolve to undefined
    });

    it('exports getSObjectValue method returning a jest.fn()', () => {
        expect(getSObjectValue).not.toBeCalled();

        getSObjectValue('foo');
        expect(getSObjectValue).toBeCalledWith('foo');
    });
});
