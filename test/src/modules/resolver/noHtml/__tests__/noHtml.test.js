/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import NoHTML from '../noHtml';

it('resolves component without HTML', () => {
    expect(() => {
        const elm = createElement('resolver-no-html', { is: NoHTML });
        document.body.appendChild(elm);
    }).not.toThrow();
});
