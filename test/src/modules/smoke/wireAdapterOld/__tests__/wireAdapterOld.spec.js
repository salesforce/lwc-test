/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { createElement } from 'lwc';
import WireAdapterOld from '../wireAdapterOld';

it('should invoke the wire adapter and render the right value', () => {
    const elm = createElement('smoked-wire-adapter-old', { is: WireAdapterOld });
    document.body.appendChild(elm);

    const paragraph = elm.shadowRoot.querySelector('p');
    expect(paragraph.textContent).toBe('test');
});
