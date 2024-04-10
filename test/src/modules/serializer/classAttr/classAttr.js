/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement } from 'lwc';

export default class ClassAttr extends LightningElement {
    undef = undefined;
    nullo = null;
    empty = '';
    space = ' ';
    test1 = 'foo bar';
    test2 = ' foo bar';
    test3 = 'foo bar ';
    test4 = ' foo  bar ';
    test5 = ' foo   bar   baz   ';
}
