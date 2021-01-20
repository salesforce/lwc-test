/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import NoCSS from '../noCss';

it('resolves components without CSS', () => {
    const element = createElement('resolver-no-css', { is: NoCSS });
    document.body.appendChild(element);

    expect(element.shadowRoot.querySelector('h1').textContent).toBe('No CSS');
});
