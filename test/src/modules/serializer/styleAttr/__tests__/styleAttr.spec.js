/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import StyleAttr from '../styleAttr';

// There is an expected warning message we can ignore
beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation((message) => {
        if (!message.includes("Invalid 'style' attribute passed to <div>")) {
            throw new Error('Unexpected console error message: ' + message);
        }
    });
});

afterEach(() => {
    jest.restoreAllMocks();
});

it('serializes component with different whitespace', () => {
    const elm = createElement('serializer-component', { is: StyleAttr });
    document.body.appendChild(elm);

    expect(elm).toMatchSnapshot();
});
