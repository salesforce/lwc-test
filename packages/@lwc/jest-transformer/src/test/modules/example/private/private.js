/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, api } from 'lwc';
import appVersion from '@salesforce/private/core.appVersion';
import untrustedContentDomain from '@salesforce/private/core.untrustedContentDomain';

export default class Private extends LightningElement {
    @api getAppVersion() {
        return appVersion;
    }

    @api getUntrustedContentDomain() {
        return untrustedContentDomain;
    }
}
