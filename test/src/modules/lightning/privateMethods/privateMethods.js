/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, api } from 'lwc';

export default class PrivateMethods extends LightningElement {
    @api value = 0;
    counter = 0;

    #incrementPrivate() {
        this.counter++;
        return this.counter;
    }

    @api
    publicMethod() {
        // Call private method from public method
        const count = this.#incrementPrivate();
        this.value = count;
        return count;
    }

    @api
    getCounter() {
        return this.counter;
    }
}
