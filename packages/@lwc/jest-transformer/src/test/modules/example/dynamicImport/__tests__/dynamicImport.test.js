/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import DynamicImport from 'example/dynamicImport';

describe('dynamic-imports', () => {
    it('should render dynamically imported component', () => {
        const element = createElement('example-dynamic-import', { is: DynamicImport });
        document.body.appendChild(element);

        return Promise.resolve()
            .then(() => Promise.resolve())
            .then(() => {
                expect(element).toMatchSnapshot();
            });
    });
});
