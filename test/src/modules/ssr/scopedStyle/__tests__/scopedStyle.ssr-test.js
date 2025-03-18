/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { renderComponent } from 'lwc';
import ScopedStyle from 'ssr/scopedStyle';

it('renders a basic component with scoped styles', async () => {
    const renderedComponent = await renderComponent('x-scoped-style', ScopedStyle);
    expect(renderedComponent).toMatchInlineSnapshot(`
        <x-scoped-style class="__lwc_scope_token__">
          <template shadowrootmode="open">
            <style class="__lwc_scope_token__" type="text/css">
              h1.__lwc_scope_token__ {color: red;}
            </style>
            <h1 class="__lwc_scope_token__">
              Scoped style test
            </h1>
          </template>
        </x-scoped-style>
    `);
});
