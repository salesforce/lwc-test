/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import WithStyleLibrary from '../withStyleLibrary';

it('component has expected styles', () => {
    const element = createElement('with-style-library', { is: WithStyleLibrary });
    document.body.appendChild(element);

    const { nativeShadow } = global['lwc-jest'];
    const styleContainer = nativeShadow ? element.shadowRoot : document.head;
    const css = [...styleContainer.querySelectorAll('style')].map(_ => _.textContent);
    const expectedCss = nativeShadow ? [
        'h1 {color: blue;}',
        'h1 {background: yellow;}'
    ] : [
        'h1[lwc-72bnmlfttf2] {color: blue;}',
        'h1[lwc-72bnmlfttf2] {background: yellow;}'
    ];
    expect(css).toEqual(expectedCss);
})
