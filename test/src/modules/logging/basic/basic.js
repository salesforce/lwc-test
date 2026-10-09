/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, api } from 'lwc';

export default class Basic extends LightningElement {
    _arr = [];

    @api
    set arr(arr) {
        console.info('Received arr:', arr);
        this._arr = arr;
    }

    get arr() {
        return this._arr;
    }

    get plainString() {
        return JSON.stringify(this.arr);
    }
}
