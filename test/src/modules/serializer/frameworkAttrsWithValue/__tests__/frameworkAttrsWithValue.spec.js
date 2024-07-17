/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import FrameworkAttrsWithValue from '../frameworkAttrsWithValue';

it('serializes a component containing framework-supplied attributes', () => {
    const elm = createElement('serializer-component', { is: FrameworkAttrsWithValue });
    document.body.appendChild(elm);

    expect(elm).toMatchSnapshot();
});
