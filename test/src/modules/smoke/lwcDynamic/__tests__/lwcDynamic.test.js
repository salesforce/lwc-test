/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import LwcDynamic from '../lwcDynamic';

it('should render dynamically imported component', (done) => {
    const element = createElement('smoke-dynamic-import', { is: LwcDynamic });
    document.body.appendChild(element);

    setTimeout(() => {
        expect(element).toMatchSnapshot();
        done();
    });
});
