/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { renderComponent } from 'lwc';
import LightDomSlotEmpty from 'ssr/lightDomSlotEmpty';

it('renders a basic component with light DOM slot with nothing slotted', () => {
    const renderedComponent = renderComponent('ssr-light-dom-slot-empty', LightDomSlotEmpty, {});

    expect(renderedComponent).toMatchSnapshot();
});
