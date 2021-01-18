/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { createElement } from 'lwc';

import WireAdapterGlobalRegistry from '../wireAdapterGlobalRegistry';
import { adapter } from '../adapter';

/**
 * Example method implemented in wire-service-jest-util
 * @param adapterId
 * @returns {{getLastConfig(): *, emit(*=): void}|*}
 */
export function registerTestAdapter(adapterId) {
    let lastConfig;
    const wiredEventTargets = new Set();

    const relatedAdapter = global.wireAdaptersRegistryHack.get(adapterId);

    relatedAdapter.adapter.spyAdapter({
        createInstance(wiredEventTarget) {
            wiredEventTargets.add(wiredEventTarget);
        },
        connect(wiredEventTarget) {
            lastConfig = {};
            wiredEventTargets.add(wiredEventTarget);
        },
        update(wiredEventTarget, config) {
            lastConfig = config;
        },
        disconnect(wiredEventTarget) {
            lastConfig = undefined;
            wiredEventTargets.delete(wiredEventTarget);
        },
    });

    return {
        emit(value) {
            wiredEventTargets.forEach((wiredEventTarget) => wiredEventTarget.emit(value));
        },
        getLastConfig() {
            return lastConfig;
        },
    };
}

const registeredAdapter = registerTestAdapter(adapter);

it('should re-render the component when a new value is emitted', () => {
    const elm = createElement('smoke-wire-adapter-global-registry', {
        is: WireAdapterGlobalRegistry,
    });
    document.body.appendChild(elm);

    expect(elm.shadowRoot.querySelector('p').textContent).toBe('');

    registeredAdapter.emit('test');
    return Promise.resolve().then(() => {
        expect(elm.shadowRoot.querySelector('p').textContent).toBe('test');
    });
});
