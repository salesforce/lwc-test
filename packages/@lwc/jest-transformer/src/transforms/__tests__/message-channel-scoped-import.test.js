/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const test = require('./utils/test-transform').test(require('../message-channel-scoped-import'));

describe('@salesforce/messageChannel import', () => {
    test(
        'does default transformation for values with __c suffix',
        `
        import myMessageChannel from '@salesforce/messageChannel/foo__c';
    `,
        `
        let myMessageChannel;

        try {
          myMessageChannel = require("@salesforce/messageChannel/foo__c").default;
        } catch (e) {
          myMessageChannel = "foo__c";
        }
    `
    );

    test(
        'does default transformation for namespaced values',
        `
        import myMessageChannel from '@salesforce/messageChannel/ns__foo';
    `,
        `
        let myMessageChannel;

        try {
          myMessageChannel = require("@salesforce/messageChannel/ns__foo").default;
        } catch (e) {
          myMessageChannel = "ns__foo";
        }
    `
    );

    test(
        'does default transformation for namespaced values with __c suffix',
        `
        import myMessageChannel from '@salesforce/messageChannel/ns__foo__c';
    `,
        `
        let myMessageChannel;

        try {
          myMessageChannel = require("@salesforce/messageChannel/ns__foo__c").default;
        } catch (e) {
          myMessageChannel = "ns__foo__c";
        }
    `
    );

    test(
        'allows non-@salesforce/messageChannel named imports',
        `
        import { otherNamed } from './something-valid';
        import myMessageChannel from '@salesforce/messageChannel/foo__c';
    `,
        `
        import { otherNamed } from './something-valid';
        let myMessageChannel;

        try {
          myMessageChannel = require("@salesforce/messageChannel/foo__c").default;
        } catch (e) {
          myMessageChannel = "foo__c";
        }
    `
    );

    test(
        'throws error if using named import',
        `
        import { myMessageChannel } from '@salesforce/messageChannel/foo__c';
    `,
        undefined,
        'Invalid import from @salesforce/messageChannel/foo__c'
    );

    test(
        'throws error if renamed default imports',
        `
        import { default as messageChannel } from '@salesforce/messageChannel/foo__c';
    `,
        undefined,
        'Invalid import from @salesforce/messageChannel/foo__c'
    );

    test(
        'throws error if renamed multiple default imports',
        `
        import { default as messageChannel, foo } from '@salesforce/messageChannel/foo__c';
    `,
        undefined,
        'Invalid import from @salesforce/messageChannel/foo__c'
    );
});
