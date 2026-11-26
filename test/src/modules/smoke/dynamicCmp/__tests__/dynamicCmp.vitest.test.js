/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { vi } from 'vitest';
import { createElement } from 'lwc';
import DynamicCmp from '../dynamicCmp';

it('should render dynamically imported component', async () => {
    const element = createElement('smoke-dynamic-import', { is: DynamicCmp });
    document.body.appendChild(element);

    // The child loads through a dynamic import, which takes longer than a timer tick.
    await vi.waitFor(() => expect(element.shadowRoot.querySelector('x-test')).not.toBeNull());

    expect(element).toMatchSnapshot();
});
