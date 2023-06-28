/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import Errors2 from '../errors2';

it('serializes component that may cause errors in serializer, part 2', async () => {
    const elm = createElement('serializer-component', { is: Errors2 });
    document.body.appendChild(elm);

    expect(elm).toMatchSnapshot();
});
