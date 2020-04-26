/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement } from 'lwc';

export default class TypeScript extends LightningElement {
    targetLanguage: string;

    connectedCallback() {
        this.targetLanguage = 'TypeScript';
    }
}
