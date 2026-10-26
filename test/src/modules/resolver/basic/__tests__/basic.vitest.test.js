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
it('component has expected styles', () => {
    const element = createElement('resolver-basic', { is: Basic });
    document.body.appendChild(element);

    const nativeShadow = inject('lwcNativeShadow');
    const styleContainer = nativeShadow ? element.shadowRoot : document.head;
    const css = styleContainer.querySelector('style').textContent;
    if (nativeShadow) {
        expect(css).toBe('h1 {color: red;}');
    } else {
        expect(css).toMatch(/^h1\[lwc-[a-z0-9]+\] \{color: red;\}$/);
    }
});
