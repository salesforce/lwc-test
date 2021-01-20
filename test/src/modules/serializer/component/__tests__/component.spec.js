/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import Component from '../component';

it('serializes component with HTML', () => {
    const elm = createElement('serializer-component', { is: Component });
    document.body.appendChild(elm);

    expect(elm).toMatchSnapshot();
});
