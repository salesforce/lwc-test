/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement } from 'lwc';

export default class extends LightningElement {
    loaded = false;

    loadHandler() {
        console.log('load handler called');
        this.loaded = true;
    }
}
