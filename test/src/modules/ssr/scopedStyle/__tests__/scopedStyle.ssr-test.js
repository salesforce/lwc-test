/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { renderAndHashComponent } from '@lwc/ssr-snapshot-utils/src/ssr-snapshot-utils';
import ScopedStyle from 'ssr/scopedStyle';

it('renders a basic component with scoped styles', () => {
    const { renderedComponent } = renderAndHashComponent('x-scoped-style', ScopedStyle);

    expect(renderedComponent).toMatchInlineSnapshot(`
        <x-scoped-style class="lwc-49s1fn4727b-host">
          <template shadowrootmode="open">
            <style class="lwc-49s1fn4727b"
                   type="text/css"
            >
              h1.lwc-49s1fn4727b {color: red;}
            </style>
            <h1 class="lwc-49s1fn4727b">
              Scoped style test
            </h1>
          </template>
        </x-scoped-style>
    `);
});
