/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement } from 'lwc';

export default class ClassAttr extends LightningElement {
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
    test6 = '  color:  blue;   text-align:   center;  ';
    test7 = '  color:  blue  ;   text-align:   center  ;';
    test8 = '  color  :  blue  ;   text-align  :   center  ;  ;  ';
    test9 = 'background-color: red !important ;';
    test10 = 'background-color: red  !important  ;';
    test11 = 'background-color:  red  !important  ;  ';
    test12 = '  background-color  :  red  !important  ;  ';
    test13 = '  background-color  :  red  !important  ;  ';
    test14 = 'color: \nline-break';
    test15 = 'color:\ttab;';
    test16 = 'color :\ttab ; \ntext-align: line-break;';
    test17 = ';;';
    test18 = ' ; ; ';
    test19 = '  color: blue  ';
    test20 = 'background-image: url(data:image/svg+xml;base64,abc123); background-size: 12px;';
}
