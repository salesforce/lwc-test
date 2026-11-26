/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Wrong shape on purpose: Jest rejects this import. Only importShape.vitest.test.js loads this
// component, through a dynamic import that expects the rejection.
import { LightningElement, api } from 'lwc';
import { foo } from '@salesforce/label/c.foo';

export default class BadLabel extends LightningElement {
    @api label = foo;
}
