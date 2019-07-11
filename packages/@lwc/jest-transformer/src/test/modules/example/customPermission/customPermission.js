/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement } from 'lwc';
import mockedImport from '@salesforce/customPermission/mocked';
import unmockedImport from '@salesforce/customPermission/unmocked';

export default class CustomPermission extends LightningElement {
    mockedResource = mockedImport;
    unmockedResource = unmockedImport;
}
