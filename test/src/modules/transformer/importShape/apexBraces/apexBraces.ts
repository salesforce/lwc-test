/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Braces form of an Apex method import. Jest binds getData to the default export, and so does
// Vitest. TypeScript, so the check must run after the TypeScript strip to see this as plain JS.
import { LightningElement, api } from 'lwc';
import { getData } from '@salesforce/apex/MyController.getData';

type Params = { id: number };

export default class ApexBraces extends LightningElement {
    @api load(params?: Params): Promise<unknown> {
        return getData(params);
    }
}
