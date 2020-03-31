/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import FooInnerTs from 'example/fooInner';

jest.mock('globalLib', () => {
    return {
        func: () => 'from test',
    };
});

describe('example-foo-inner', () => {
    it('default snapshot', () => {
        const element = createElement('example-foo-inner', { is: FooInnerTs });
        document.body.appendChild(element);
        expect(element).toMatchSnapshot();
    });

    it('returns value from mock defined in test file', () => {
        const element = createElement('example-foo-inner', { is: FooInnerTs });
        expect(element.globalLibReturn).toBe('from test');
    });
});
