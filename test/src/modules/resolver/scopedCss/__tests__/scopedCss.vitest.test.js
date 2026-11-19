/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createRequire } from 'node:module';
import { inject } from 'vitest';
import { createElement } from 'lwc';
import Basic from '../basic';

const { isKnownScopeToken } = createRequire(import.meta.url)('@lwc/jest-shared');

it('component has expected scoped styles', () => {
    const element = createElement('resolver-basic', { is: Basic });
    document.body.appendChild(element);

    const styleContainer = inject('lwcNativeShadow') ? element.shadowRoot : document.head;
    const css = styleContainer.querySelector('style').textContent;
    expect(css).toEqual('h1.lwc-2upvglv5e7t {color: red;}');
});

// The snapshot serializer only replaces registered tokens, so register the one that is rendered.
it('registers the scope token it renders', () => {
    expect(isKnownScopeToken('lwc-2upvglv5e7t')).toBe(true);
});
