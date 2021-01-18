/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { register, ValueChangedEvent } from 'wire-service';

// This is the old-fashion way to declare a wire adapter prior the wire reform. We keep this here
// for now for backward compat purposes.
export const adapter = () => {};

register(adapter, (wireEventTarget) => {
    wireEventTarget.addEventListener('config', (config) => {
        wireEventTarget.dispatchEvent(new ValueChangedEvent(config.value));
    });
});
