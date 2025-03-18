/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { renderComponent } from 'lwc';
import ScopedStyleHostLight from 'ssr/scopedStyleHostLight';

it('renders a basic component with scoped styles, light DOM with :host', async () => {
    const renderedComponent = await renderComponent('x-scoped-style', ScopedStyleHostLight);

    expect(renderedComponent).toMatchInlineSnapshot(`
        <x-scoped-style class="__lwc_scope_token__">
          <style class="__lwc_scope_token__" type="text/css">
            h1.__lwc_scope_token__ {color: red;}.__lwc_scope_token__ {color: blue;}
          </style>
          <h1 class="__lwc_scope_token__">
            Scoped style test
          </h1>
        </x-scoped-style>
    `);
});
