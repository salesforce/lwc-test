/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import UserPermission from 'example/userPermission';

jest.mock(
    '@salesforce/userPermission/mocked',
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

describe('example-user-permission', () => {
    it('default snapshot', () => {
        const element = createElement('example-user-permission', { is: UserPermission });
        document.body.appendChild(element);
        expect(element).toMatchSnapshot();
    });

    it('returns default permission value as import path', () => {
        const element = createElement('example-user-permission', { is: UserPermission });
        document.body.appendChild(element);
        const userPermissionValue = document.body
            .querySelector('example-user-permission')
            .shadowRoot.querySelector('.unmockedPermission').textContent;
        expect(userPermissionValue).toBe('unmocked');
    });

    it('returns value from mock defined in test file', () => {
        const element = createElement('example-user-permission', { is: UserPermission });
        document.body.appendChild(element);
        const userPermissionValue = document.body
            .querySelector('example-user-permission')
            .shadowRoot.querySelector('.mockedPermission').textContent;
        expect(userPermissionValue).toBe('value set in test');
    });
});
