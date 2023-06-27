/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import Basic from '../basic';

it('resolves basic component', () => {
    const element = createElement('resolver-basic', { is: Basic });
    document.body.appendChild(element);

    expect(element.shadowRoot.querySelector('h1').textContent).toEqual('Basic');
});

it('component has expected styles', () => {
    const element = createElement('resolver-basic', { is: Basic });
    document.body.appendChild(element);

    const { nativeShadow } = global['lwc-jest']
    const styleContainer = nativeShadow ? element.shadowRoot : document.head;
    const css = styleContainer.querySelector('style').textContent;
    const expectedCss = nativeShadow ? 'h1 {color: red;}' : 'h1[resolver-basic_basic] {color: red;}'
    expect(css).toEqual(expectedCss);
})
