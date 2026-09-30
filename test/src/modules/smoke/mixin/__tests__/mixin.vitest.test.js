/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import Mixin from '../mixin';

it('should render the component using mixin api attribute', () => {
    const element = createElement('smoke-mixin', { is: Mixin });
    element.value = 'test';
    document.body.appendChild(element);

    const paragraph = element.shadowRoot.querySelector('p');
    expect(paragraph.textContent).toBe('test');
});
