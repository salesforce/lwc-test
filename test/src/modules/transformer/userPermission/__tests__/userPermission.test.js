/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { mockedUserPermission, unmockedUserPermission } from '../userPermission';

jest.mock(
    '@salesforce/userPermission/mocked',
    () => {
        return { default: 'mock override' };
    },
    { virtual: true }
);

it('returns default value when import is not mocked', () => {
    expect(unmockedUserPermission).toBe('unmocked');
});

it('returns mocked value when import is mocked', () => {
    expect(mockedUserPermission).toBe('mock override');
});
