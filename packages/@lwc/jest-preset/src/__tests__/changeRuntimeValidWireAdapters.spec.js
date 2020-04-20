/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import { registerTestAdapter } from "./utils";
import WiredComponent from 'example/wiredComponent';
import { realAdapter } from 'example/adapter';

const genericAdapter = registerTestAdapter(realAdapter);

afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

describe('valid non mocked wire adapters used via register* calls', () => {
    it('should use mocked implementation', () => {
        const expectedTextResult = 'some test value';

        const element = createElement('example-simple-component', { is: WiredComponent });
        element.txt = expectedTextResult;

        document.body.appendChild(element);

        return Promise.resolve()
            .then(() => {
                expect(genericAdapter.getLastConfig()).toEqual({ text: expectedTextResult });
            })
            .then(() => {
                const paragraphWithText = element.shadowRoot.querySelector('.wired-text');
                // The original adapter is overwritten, it should not emit any value
                expect(paragraphWithText.textContent).toBe('');

                genericAdapter.emit({ text: expectedTextResult });
            })
            .then(() => {
                const paragraphWithText = element.shadowRoot.querySelector('.wired-text');
                expect(paragraphWithText.textContent).toBe(expectedTextResult);
            })
    });
});
