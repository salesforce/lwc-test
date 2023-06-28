/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, api } from 'lwc';

export default class extends LightningElement {
    @api
    get attributes() {
        const stack = new Error().stack;
        // Cause an error to be thrown only when called from @lwc/jest-serializer,
        // so that we don't break unrelated code
        if (stack.includes('clean-element-attrs.js')) {
            return [
                { name: null, value: null }
            ];
        }
        return [];
    }
}
