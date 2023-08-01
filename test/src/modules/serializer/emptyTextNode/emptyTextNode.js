/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement } from 'lwc';

export default class EmptyTextNode extends LightningElement {
    static renderMode = 'light';

    renderedCallback() {
        const h1 = document.createElement('h1');
        h1.textContent = 'hello';

        this.refs.div.appendChild(document.createTextNode(''));
        this.refs.div.appendChild(h1);
        this.refs.div.appendChild(document.createTextNode(''));
    }
}
