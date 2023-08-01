/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

describe('serialized element attributes', () => {
    it('should remove the lwc:host attribute', () => {
        const elm = document.createElement('div');
        elm.innerHTML = `
            <div lwc:host="12345">12345</div>
            <div lwc:host="abcde">abcde</div>
        `.replace(/\s+/g, ' ');
        expect(elm).toMatchSnapshot();
    });
});
