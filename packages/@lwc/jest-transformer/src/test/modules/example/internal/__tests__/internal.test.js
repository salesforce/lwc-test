/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import Internal from 'example/internal';

jest.mock(
    '@salesforce/internal/core.appVersion',
    () => {
        return { default: 'appVersion value set in test' };
    },
    { virtual: true }
);

describe('example-internal-resource', () => {
    describe('@salesforce/internal/core.appVersion', () => {
        it('should return value from mock defined in test file', () => {
            const element = createElement('example-internal', {
                is: Internal,
            });

            const value = element.getAppVersion();
            expect(value).toBe('appVersion value set in test');
        });
    });

    describe('@salesforce/internal/core.untrustedContentDomain', () => {
        it('should return default value as import path', () => {
            const element = createElement('example-internal', {
                is: Internal,
            });

            const value = element.getUntrustedContentDomain();
            expect(value).toBe('.a.forceusercontent.com');
        });
    });
});
