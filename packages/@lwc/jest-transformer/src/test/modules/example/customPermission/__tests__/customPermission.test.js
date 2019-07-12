/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import CustomPermission from 'example/customPermission';

jest.mock(
    '@salesforce/customPermission/mocked',
    () => {
        return { default: 'value set in test' };
    },
    { virtual: true }
);

afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

describe('example-custom-permission', () => {
    it('default snapshot', () => {
        const element = createElement('example-custom-permission', { is: CustomPermission });
        document.body.appendChild(element);
        expect(element).toMatchSnapshot();
    });

    it('returns default permission value as import path', () => {
        const element = createElement('example-custom-permission', { is: CustomPermission });
        document.body.appendChild(element);
        const customPermissionValue = document.body
            .querySelector('example-custom-permission')
            .shadowRoot.querySelector('.unmockedPermission').textContent;
        expect(customPermissionValue).toBe('unmocked');
    });

    it('returns value from mock defined in test file', () => {
        const element = createElement('example-custom-permission', { is: CustomPermission });
        document.body.appendChild(element);
        const customPermissionValue = document.body
            .querySelector('example-custom-permission')
            .shadowRoot.querySelector('.mockedPermission').textContent;
        expect(customPermissionValue).toBe('value set in test');
    });
});
