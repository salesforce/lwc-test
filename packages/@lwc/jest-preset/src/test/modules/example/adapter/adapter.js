/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { register, ValueChangedEvent } from "wire-service";

export const mockedWireAdapter = jest.fn();

export const realAdapter = jest.fn();

register(realAdapter, (wireEventTarget) => {
    wireEventTarget.addEventListener('config', (config) => {
        wireEventTarget.dispatchEvent(new ValueChangedEvent(config));
    });
});
