/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
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
