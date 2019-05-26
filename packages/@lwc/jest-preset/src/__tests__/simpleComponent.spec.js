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
    describe('importing @salesforce/apex', () => {
        it('returns a Promise that resolves for the default import', () => {
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
