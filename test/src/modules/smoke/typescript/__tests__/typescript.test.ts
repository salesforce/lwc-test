/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import TypeScript from '../typescript';

describe('example-typescript', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('should render correct snapshot', () => {
        const element = createElement('example-typescript', { is: TypeScript });
        document.body.appendChild(element);
        expect(element).toMatchSnapshot();
    });

    it('renders two p tags', () => {
        const element = createElement('example-foo', { is: TypeScript });
        document.body.appendChild(element);
        const elementsP = element.shadowRoot.querySelectorAll('p');
        expect(elementsP).toHaveLength(2);
    });

    it('renders dynamic text correctly in the 2nd p tag', () => {
        const message = 'Validating if the transformation to TypeScript has worked.';
        const element = createElement('example-foo', { is: TypeScript });
        document.body.appendChild(element);
        const elementP = element.shadowRoot.querySelectorAll('p')[1];
        expect(elementP.textContent).toEqual(message);
    });

    it('tracks dynamic text in div which was not initialized', async () => {
        const element = createElement('example-typescript', { is: TypeScript });
        document.body.appendChild(element);
        element.initialize();
        await Promise.resolve();
        const elementDiv = element.shadowRoot.querySelector('div');
        expect(elementDiv.textContent).toEqual('Validating if unitialized initialized is tracked.');
    });
});
