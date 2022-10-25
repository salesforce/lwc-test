/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { api } from 'lwc';
import Superclass  from 'components/superclass';

export default class extends Superclass {
    @api bar = "bar"
}
