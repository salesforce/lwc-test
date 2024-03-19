/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import Iframe from '../iframe';

it('should render once iframe is loaded', async () => {
    const element = createElement('x-iframe', { is: Iframe });
    document.body.appendChild(element);
    await Promise.resolve();

    expect(element.shadowRoot.querySelector('span')).not.toBeNull();
});
