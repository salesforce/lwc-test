/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement } from 'lwc';

import template from './manualStylesheets.html';
import stylesheet from './manualStylesheets.css';

export default class extends LightningElement {
    render() {
        // NOTE: This is an unsupported hack, but it's used in the wild, and it works outside of
        // Jest, so for now we should support it.
        template.stylesheets = [stylesheet];
        return template;
    }
}
