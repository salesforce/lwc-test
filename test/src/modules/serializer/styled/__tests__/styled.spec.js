/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import Styled from '../styled';

it('serializes component with HTML - styled in shadow DOM', () => {
    const elm = createElement('serializer-component', { is: Styled });
    document.body.appendChild(elm);

    if (global['lwc-jest'].nativeShadow) {
        expect(elm).toMatchInlineSnapshot(`
            <serializer-component
              class="lwc-xxxxxx"
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
                  h1.lwc-xxxxxx {background: blue;}
                </style>
                <h1
                  class="lwc-xxxxxx"
                >
                  I am an LWC component
                </h1>
            </serializer-component>
        `);
    } else {
        expect(elm).toMatchInlineSnapshot(`
            <serializer-component
              class="lwc-xxxxxx"
              lwc-xxxxxx=""
            >
              #shadow-root(open)
                <h1
                  class="lwc-xxxxxx"
                  lwc-xxxxxx=""
                >
                  I am an LWC component
                </h1>
            </serializer-component>
        `);
    }
});
