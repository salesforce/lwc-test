/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import { registerTestAdapter } from './utils';
import SimpleComponent from 'example/simpleComponent';
import { mockedWireAdapter } from 'example/adapter';

afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

const genericAdapter = registerTestAdapter(mockedWireAdapter);

describe('test a component with invalid mock as wire-adapter is working in jsdom', () => {
    it('should render the component using mock wire implementation', () => {
        const element = createElement('example-simple-component', { is: SimpleComponent });
        document.body.appendChild(element);

        return Promise.resolve()
            .then(() => {
                const paragraphWithText = element.shadowRoot.querySelector('.wired-text');
                expect(paragraphWithText.textContent).toBe('');

                genericAdapter.emit('some test value');
            })
            .then(() => {
                const paragraphWithText = element.shadowRoot.querySelector('.wired-text');
                expect(paragraphWithText.textContent).toBe('some test value');
            });
    });
});
