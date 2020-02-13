	/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import AccessCheck from 'example/accessCheck';

jest.mock(
    '@salesforce/accessCheck/mocked',
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

describe('example-access-check', () => {
    it('default snapshot', () => {
        const element = createElement('example-access-check', { is: AccessCheck });
        document.body.appendChild(element);
        expect(element).toMatchSnapshot();
    });

    it('returns default permission value as import path', () => {
        const element = createElement('example-access-check', { is: AccessCheck });
        document.body.appendChild(element);
        const accessCheckValue = document.body
            .querySelector('example-access-check')
            .shadowRoot.querySelector('.unmockedPermission').textContent;
        expect(accessCheckValue).toBe('unmocked');
    });

    it('returns value from mock defined in test file', () => {
        const element = createElement('example-access-check', { is: AccessCheck });
        document.body.appendChild(element);
        const accessCheckValue = document.body
            .querySelector('example-access-check')
            .shadowRoot.querySelector('.mockedPermission').textContent;
        expect(accessCheckValue).toBe('value set in test');
    });
});