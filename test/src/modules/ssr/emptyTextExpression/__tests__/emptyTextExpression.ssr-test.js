/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { renderComponent } from 'lwc';
import EmptyTextExpression from 'ssr/emptyTextExpression';

it('renders a basic component with an empty text expression', async () => {
    const renderedComponent = await renderComponent(
        'ssr-empty-text-expression',
        EmptyTextExpression,
        {}
    );

    expect(renderedComponent).toMatchSnapshot();
});
