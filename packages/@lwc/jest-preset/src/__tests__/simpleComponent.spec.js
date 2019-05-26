/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import SimpleComponent from 'example/simpleComponent';

afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

describe('example-simpleComponent', () => {
    describe('test that the synthetic-shadow is working in jsdom', () => {
        it('should render the component and query the shadow dom', () => {
            const element = createElement('example-simple-component', { is: SimpleComponent });
            document.body.appendChild(element);
            return Promise.resolve().then(() => {
                const simpleComponent = document.querySelector('example-simple-component');
                expect(simpleComponent).not.toBeNull();

                expect(document.querySelector('.text-content')).toBeNull();

                const paragraphWithText = simpleComponent.shadowRoot.querySelector('.text-content');
                expect(paragraphWithText).not.toBeNull();
            });
        });
    });
});
