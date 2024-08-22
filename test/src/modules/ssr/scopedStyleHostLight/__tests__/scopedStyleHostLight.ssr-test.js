/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { generateAndSnapshotMarkup } from '@lwc/ssr-snapshot-utils/src/ssr-snapshot-utils';
import ScopedStyleHostLight from 'ssr/scopedStyleHostLight';

it('renders a basic component with scoped styles, light DOM with :host', () => {
    const { renderedComponent } = generateAndSnapshotMarkup('x-scoped-style', ScopedStyleHostLight);

    expect(renderedComponent).toMatchInlineSnapshot(
        `<x-scoped-style class="lwc-3nvo014iss4-host"><style class="lwc-3nvo014iss4" type="text/css">h1.lwc-3nvo014iss4 {color: red;}.lwc-3nvo014iss4-host {color: blue;}</style><h1 class="lwc-3nvo014iss4">Scoped style test</h1></x-scoped-style>`,
    );
});
