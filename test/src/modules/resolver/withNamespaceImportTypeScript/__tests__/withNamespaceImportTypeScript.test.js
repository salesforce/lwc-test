/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import WithNamespaceImportTypeScript from '../withNamespaceImportTypeScript';

it('component can import superclass from namespace - typescript', () => {
    const element = createElement('with-namespace-import-typescript', { is: WithNamespaceImportTypeScript });
    document.body.appendChild(element);

    expect(element.foo).toEqual('fooTS'); // from superclass
    expect(element.bar).toEqual('barTS'); // from own class
});
