/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import WithNamespaceImport from '../withNamespaceImport';

it('component can import superclass from namespace', () => {
    const element = createElement('with-namespace-import', { is: WithNamespaceImport });
    document.body.appendChild(element);

    expect(element.foo).toEqual('foo'); // from superclass
    expect(element.bar).toEqual('bar'); // from own class
});
