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

// require() rather than import: it's the copy the snapshot serializer reads (see scope-tokens.js).
const { hasKnownScopeTokens, isKnownScopeToken, getKnownScopeTokensRegex } = createRequire(
    import.meta.url
)('@lwc/jest-shared');

// Compare against the token actually rendered, not a literal: it depends on the compiled
// namespace/name, which W-24634599 changes.
function render() {
    const element = createElement('resolver-basic', { is: Basic });
    document.body.appendChild(element);
    const styleContainer = inject('lwcNativeShadow') ? element.shadowRoot : document.head;
    const css = styleContainer.querySelector('style').textContent;
    const [, token] = css.match(/^h1\.(\S+) \{/);
    return { element, css, token };
}

it('registers scope tokens when the template is imported', () => {
    expect(hasKnownScopeTokens()).toBe(true);
});

it('knows the scope token applied to the rendered element', () => {
    const { element, token } = render();
    expect(element.shadowRoot.querySelector('h1').classList).toContain(token);
    expect(isKnownScopeToken(token)).toBe(true);
});

it('matches the scope token in the stylesheet text', () => {
    const { css, token } = render();
    expect(css.match(getKnownScopeTokensRegex())).toContain(token);
});
