/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, api } from 'lwc';

import MY_MOCKED_CHANNEL from '@salesforce/messageChannel/myMockedChannel__c';
import MY_UNMOCKED_CHANNEL from '@salesforce/messageChannel/myUnmockedChannel__c';
import ANOTHER_MOCKED_CHANNEL from '@salesforce/messageChannel/ns__anotherMockedChannel__c';

export default class MessageChannel extends LightningElement {
    @api getMyMsgChannel() {
        return MY_MOCKED_CHANNEL;
    }

    @api getUnmockedChannel() {
        return MY_UNMOCKED_CHANNEL;
    }

    @api getAnotherMsgChannel() {
        return ANOTHER_MOCKED_CHANNEL;
    }
}
