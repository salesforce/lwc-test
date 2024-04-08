/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import StyleAttr from '../styleAttr';

it('serializes component with different whitespace', () => {
    const elm = createElement('serializer-component', { is: StyleAttr });
    document.body.appendChild(elm);

    expect(elm).toMatchSnapshot();
});
