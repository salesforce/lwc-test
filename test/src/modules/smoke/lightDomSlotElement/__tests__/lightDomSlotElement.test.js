/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
// import LightDomSlotElement from '../lightDomSlotElement';
import LightDomSlotElement from 'smoke/lightDomSlotElement';

it('serializes slotted light DOM content', () => {
    const elm = createElement('serializer-component', { is: LightDomSlotElement });
    document.body.appendChild(elm);

    expect(elm).toMatchInlineSnapshot(`
      <serializer-component>
        <smoke-light-dom-slottable>
          <div>
            Hello
          </div>
        </smoke-light-dom-slottable>
      </serializer-component>
    `);
});
    // expect(renderedComponent).toMatchSnapshot();