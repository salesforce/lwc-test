/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

it.each([
    ['undefined', undefined],
    ['null', null],
    ['empty object', {}],
    ['without the nodeType property', { anotherKindOfProperty: 5 }],
    ['with an element node type', document.createElement('div')],
    ['with a text node type', document.createTextNode('')],
    ['with a comment node type', document.createComment('')],
    ['with another kind of node type', document.createAttribute('foo')],
])('should return the expected state when we have %s', (useCase, input) => {
    expect(input).toMatchSnapshot();
});
