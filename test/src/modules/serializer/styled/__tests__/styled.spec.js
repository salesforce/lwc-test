/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import Styled from '../styled';

it('serializes component with HTML - styled in native shadow', () => {
    const elm = createElement('serializer-component', { is: Styled });
    document.body.appendChild(elm);

    if (global['lwc-jest'].nativeShadow) {
        expect(elm).toMatchInlineSnapshot(`
            <serializer-component
              class="x-test_styled-host"
            >
              #shadow-root(open)
                <style
                  type="text/css"
                >
                  h1 {color: red;}
                </style>
                <style
                  type="text/css"
                >
                  h1.x-test_styled {background: blue;}
                </style>
                <h1
                  class="x-test_styled"
                >
                  I am an LWC component
                </h1>
            </serializer-component>
        `);
    } else {
        expect(elm).toMatchInlineSnapshot(`
            <serializer-component
              class="x-test_styled-host"
              x-test_styled-host=""
            >
              #shadow-root(open)
                <h1
                  class="x-test_styled"
                  x-test_styled=""
                >
                  I am an LWC component
                </h1>
            </serializer-component>
        `);
    }
});
