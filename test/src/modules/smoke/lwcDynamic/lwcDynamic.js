/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement } from 'lwc';

export default class LwcDynamic extends LightningElement {
    ctor = null;

    connectedCallback() {
        this.loadCtor();
    }

    async loadCtor() {
        const moduleName = 'smoke/child';
        const module = await import(moduleName);

        this.ctor = module.default;
    }
}
