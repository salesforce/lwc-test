/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, api, wire } from 'lwc';
import { realAdapter } from 'example/adapter';

export default class WiredComponent extends LightningElement {
    @api txt;

    wiredText;

    @wire(realAdapter, { text: '$txt' })
    setAdapterResult(value) {
        this.wiredText = value.text;
    }
}
