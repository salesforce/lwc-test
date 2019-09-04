/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import MessageChannel from 'example/messageChannel';

jest.mock(
    '@salesforce/messageChannel/myMockedChannel__c',
    () => {
        return { default: "my channel value from test" };
    },
    { virtual: true }
);

jest.mock(
    '@salesforce/messageChannel/ns__anotherMockedChannel__c',
    () => {
        return { default: "another channel value from test" };
    },
    { virtual: true }
);

afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

describe('example-message-channel', () => {
    describe('importing @salesforce/messageChannel', () => {
        it('returns a value that resolves for the default import', () => {
            const element = createElement('example-message-channel', { is: MessageChannel });
            document.body.appendChild(element);
            const channel = element.getMyMsgChannel();
            expect(channel).not.toBeNull();
            expect(channel).toBe("my channel value from test");
        });

        it('returns a value that resolves for a second imported message channel', () => {
            const element = createElement('example-message-channel', { is: MessageChannel });
            document.body.appendChild(element);
            const channel = element.getAnotherMsgChannel();
            expect(channel).not.toBeNull();
            expect(channel).toBe("another channel value from test");
        });

        it('returns default message channel value as import path', () => {
            const element = createElement('example-message-channel', { is: MessageChannel });
            document.body.appendChild(element);
            const channel = element.getUnmockedChannel();
            expect(channel).not.toBeNull();
            expect(channel).toBe("myUnmockedChannel__c");
        });
    });
});
