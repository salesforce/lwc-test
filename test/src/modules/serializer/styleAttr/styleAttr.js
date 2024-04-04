/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement } from 'lwc';

export default class ClassAttr extends LightningElement {
    obj = {};
    num = 1;
    bool = false;
    undef = undefined;
    nullo = null;
    empty = '';
    space = ' ';
    test1 = ' color:blue; text-align:center ';
    test2 = 'color:blue;text-align:center ';
    test3 = ' color:blue;text-align:center';
    test4 = 'color:blue;  text-align:center';
    test5 = '  color:  blue;   text-align:   center  ';
}
