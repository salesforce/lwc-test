/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import Basic from '../basic';

it('component has expected scoped styles', () => {
    const element = createElement('resolver-basic', { is: Basic });
    document.body.appendChild(element);

    const styleContainer = global['lwc-jest'].nativeShadow ? element.shadowRoot : document.head;
    const css = styleContainer.querySelector('style').textContent;
    expect(css).toEqual('h1.x-test_basic {color: red;}');
});
