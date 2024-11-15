/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement } from 'lwc';

export default class FrameworkAttrsWithValue extends LightningElement {
    static renderMode = 'light';

    connectedCallback() {
        // Typically this is only added by the framework itself, but here we are explicitly adding it
        // to make the test simpler
        this.setAttribute('data-lwc-host-mutated', 'class data-foo');
        this.setAttribute('data-lwc-host-scope-token', 'foo');
    }
}
