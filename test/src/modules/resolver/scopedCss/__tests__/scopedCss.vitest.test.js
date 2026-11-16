/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { inject } from 'vitest';
import { createElement } from 'lwc';
import Basic from '../basic';

// Scope tokens differ from Jest's (path-derived namespace), so match the token's shape.
it('component has expected scoped styles', () => {
    const element = createElement('resolver-basic', { is: Basic });
    document.body.appendChild(element);

    const styleContainer = inject('lwcNativeShadow') ? element.shadowRoot : document.head;
    const css = styleContainer.querySelector('style').textContent;
    expect(css).toMatch(/^h1\.lwc-[a-z0-9]+ \{color: red;\}$/);
});
