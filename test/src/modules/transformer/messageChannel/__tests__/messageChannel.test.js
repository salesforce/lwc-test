/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { mockedChannel, unmockedChannel } from '../messageChannel';

jest.mock(
    '@salesforce/messageChannel/myMockedChannel__c',
    () => {
        return { default: 'mock override' };
    },
    { virtual: true }
);

it('returns default value when import is not mocked', () => {
    expect(unmockedChannel).toBe('myUnmockedChannel__c');
});

it('returns mocked value when import is mocked', () => {
    expect(mockedChannel).toBe('mock override');
});
