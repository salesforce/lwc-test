/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { inject } from 'vitest';
import { createElement } from 'lwc';
import Basic from '../basic';

it('component has expected styles', () => {
    const element = createElement('resolver-basic', { is: Basic });
    document.body.appendChild(element);

    const nativeShadow = inject('lwcNativeShadow');
    const styleContainer = nativeShadow ? element.shadowRoot : document.head;
    const css = styleContainer.querySelector('style').textContent;
    expect(css).toBe(nativeShadow ? 'h1 {color: red;}' : 'h1[lwc-2upvglv5e7t] {color: red;}');
});
