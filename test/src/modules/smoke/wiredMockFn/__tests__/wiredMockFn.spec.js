/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { createElement } from 'lwc';
import WiredMockFn from '../wiredMockFn';

it("shouldn't throw when creating a component with a mocked wire adapter", () => {
    expect(() => {
        const elm = createElement('smoked-wired-mock-fn', { is: WiredMockFn });
        document.body.appendChild(elm);
    }).not.toThrow();
});
