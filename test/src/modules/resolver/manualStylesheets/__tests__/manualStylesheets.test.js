/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import ManualStylesheets from '../manualStylesheets';

// There is an expected deprecation error message we can ignore
beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation((message) => {
        if (
            !message.includes(
                'Dynamically setting the "stylesheets" property on a template function is deprecated',
            )
        ) {
            throw new Error('Unexpected console error message: ' + message);
        }
    });
});

afterEach(() => {
    jest.restoreAllMocks();
});

it('works with attaching manual stylesheets', () => {
    const element = createElement('resolver-basic', { is: ManualStylesheets });
    document.body.appendChild(element);

    expect(element.shadowRoot.querySelector('h1').textContent).toBe('Manual');
});
