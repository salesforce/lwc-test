/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import PrivateMethods from '../privateMethods';

describe('lightning private methods', () => {
    it('should allow calling private methods from public methods', () => {
        const element = createElement('lightning-private-methods', { is: PrivateMethods });
        document.body.appendChild(element);

        expect(element.publicMethod()).toBe(1);
        expect(element.value).toBe(1);
        expect(element.getCounter()).toBe(1);
    });

    it('should maintain state across multiple calls', () => {
        const element = createElement('lightning-private-methods', { is: PrivateMethods });
        document.body.appendChild(element);

        element.publicMethod();
        element.publicMethod();
        const result = element.publicMethod();

        expect(result).toBe(3);
        expect(element.getCounter()).toBe(3);
    });
});
