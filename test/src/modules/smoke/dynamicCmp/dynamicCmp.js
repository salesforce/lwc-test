/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, api } from 'lwc';

export default class extends LightningElement {
    @api ctor;
    _moduleName;

    @api
    set moduleName(name) {
        this._moduleName = name;
        this.loadCtor();
    }

    get moduleName() {
        return this._moduleName;
    }

    async loadCtor() {
        const module = await import(this.moduleName);
        this.ctor = module.default;
    }
}
