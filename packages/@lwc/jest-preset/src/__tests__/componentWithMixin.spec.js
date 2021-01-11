/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import ComponentWithMixin from 'example/componentWithMixin';

afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

describe('example-component-with-mixin', () => {
    it('should render the component using mixin api attribute', () => {
        const element = createElement('example-component-with-mixin', { is: ComponentWithMixin });
        element.txt = 'test value';
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const paragraphWithText = element.shadowRoot.querySelector('.result-text');
            expect(paragraphWithText.textContent).toBe('test value');
        });
    });
});
