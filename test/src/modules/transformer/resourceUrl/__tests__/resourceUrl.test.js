/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { mockedResourceUrl, unmockedResourceUrl } from '../resourceUrl';

jest.mock(
    '@salesforce/resourceUrl/mocked',
    () => {
        return { default: 'mock override' };
    },
    { virtual: true }
);

it('returns default value when import is not mocked', () => {
    expect(unmockedResourceUrl).toBe('unmocked');
});

it('returns mocked value when import is mocked', () => {
    expect(mockedResourceUrl).toBe('mock override');
});
