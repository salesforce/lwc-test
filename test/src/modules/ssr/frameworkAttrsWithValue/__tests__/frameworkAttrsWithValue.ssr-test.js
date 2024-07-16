/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { renderComponent } from 'lwc';
import FrameworkAttrsWithValue from '../frameworkAttrsWithValue';

it('serializes component with framework-supplied attributes with value', () => {
    const renderedComponent = renderComponent('x-basic', FrameworkAttrsWithValue, {});

    expect(renderedComponent).toMatchSnapshot();
});
