/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import WiredComponent from 'example/wiredComponent';
import { realAdapter } from 'example/adapter';

afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

describe('valid non mocked wire adapters', () => {
    it('should call original adapter function when invoked imperatively', () => {
        realAdapter('arg1', 'arg2');
        expect(realAdapter).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should render the component using original wire adapter implementation', () => {
        const element = createElement('example-simple-component', { is: WiredComponent });
        element.txt = 'some test value';

        document.body.appendChild(element);

        return Promise.resolve()
            .then(() => {
                // first tick we wait for dynamic parameters.
                // In this tick, we get the value from the wire and component re-renders
            })
            .then(() => {
                const paragraphWithText = element.shadowRoot.querySelector('.wired-text');
                expect(paragraphWithText.textContent).toBe('some test value');
            });
    });
});
