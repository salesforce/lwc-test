/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { renderComponent } from 'lwc';
import ScopedStyle from 'ssr/scopedStyle';

it('renders a basic component with scoped styles', () => {
    const renderedComponent = renderComponent('x-scoped-style', ScopedStyle);

    expect(renderedComponent).toMatchInlineSnapshot(`
        <x-scoped-style class="x-test_scopedStyle-host">
          <template shadowroot="open">
            <style class="x-test_scopedStyle" type="text/css">
              h1.x-test_scopedStyle {color: red;}
            </style>
            <h1 class="x-test_scopedStyle">
              Scoped style test
            </h1>
          </template>
        </x-scoped-style>
    `);
});
