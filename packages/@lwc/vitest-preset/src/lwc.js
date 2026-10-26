/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// What `lwc` resolves to: engine-dom with a wrapped registerDecorators. Jest patches the CJS
// engine in place; an ESM namespace can't be patched, so the local export shadows `export *`.
import { registerDecorators as originalRegisterDecorators } from '@lwc/engine-dom';

export * from '@lwc/engine-dom';

// Provides temporary backward compatibility for wire-protocol reform: lwc > 1.5.0
global.wireAdaptersRegistryHack = new Map();

function isValidWireAdapter(adapter) {
    let isValid = false;
    if (typeof adapter === 'function') {
        // lets check, if it is a valid adapter
        try {
            const adapterInstance = new adapter(() => {});
            isValid =
                typeof adapterInstance.connect === 'function' &&
                typeof adapterInstance.update === 'function' &&
                typeof adapterInstance.disconnect === 'function';
        } catch (e) {
            isValid = false;
        }
    }

    return isValid;
}

/**
 * Returns a wire adapter mock in the shape of:
 *
 * fn         : Used when adapter is invoked imperatively. It proxies to the original adapter function, if is callable.
 * fn.adapter : A valid wire adapter class, consumable by @lwc/engine-dom.
 *              If the @originalAdapter.adapter or @originalAdapter is a valid wire adapter class, fn.adapter will
 *              act as a proxy on it until a spy is attached.
 *
 * @param originalAdapter
 * @returns {function(...[*]): *}
 */
function createWireAdapterMockClass(originalAdapter) {
    const noopAdapter = {
        connect() {},
        update() {},
        disconnect() {},
    };
    let baseAdapter;
    let baseAdapterFn = () => {};
    const spies = [];

    if (Object.prototype.hasOwnProperty.call(originalAdapter, 'adapter')) {
        // Is more likely that the originalAdapter was registered with the wire service
        // .adapter is the one that the engine will use, lets make it our base adapter
        baseAdapter = originalAdapter.adapter;
    } else if (isValidWireAdapter(originalAdapter)) {
        // it may be the case that original adapter is a valid one, if is the case, lets use it as our base adapter
        baseAdapter = originalAdapter;
    }

    if (typeof originalAdapter === 'function') {
        // Mostly used in apex methods
        baseAdapterFn = originalAdapter;
    }

    // Support for adapters to be called imperatively, mainly for apex.
    const newAdapterMock = function (...args) {
        return baseAdapterFn.call(this, ...args);
    };

    newAdapterMock.adapter = class WireAdapterMock {
        constructor(dataCallback) {
            // if a test is spying these adapter, it means is overriding the implementation
            this._originalAdapter =
                spies.length === 0 && baseAdapter ? new baseAdapter(dataCallback) : noopAdapter;
            this._dataCallback = dataCallback;

            spies.forEach((spy) => spy.createInstance(this));
        }
        connect() {
            spies.forEach((spy) => spy.connect(this));
            this._originalAdapter.connect();
        }
        update(config) {
            spies.forEach((spy) => spy.update(this, config));
            this._originalAdapter.update(config);
        }
        disconnect() {
            spies.forEach((spy) => spy.disconnect(this));
            this._originalAdapter.disconnect();
        }
        emit(value) {
            this._dataCallback(value);
        }
        static spyAdapter(spy) {
            // this function is meant to be used by wire-service-jest-util library.
            // When this is used, register* was called, thus replacing the wire behaviour.
            // As consequence, it will stop calling the originalAdapter on new instances.
            spies.push(spy);
        }
    };

    return newAdapterMock;
}

export function registerDecorators(Ctor, decoratorsMeta) {
    const wire = decoratorsMeta.wire || {};

    Object.keys(wire).forEach((adapterName) => {
        const adapter = wire[adapterName].adapter;
        let wireAdapterMock = global.wireAdaptersRegistryHack.get(adapter);

        if (!wireAdapterMock) {
            // Checking if the adapter is extensible, since with the wire reform,
            // the adapterId must be:
            // a) An extensible object (so backward compatibility is provided via register)
            // b) A valid class.

            if (!Object.isExtensible(adapter)) {
                // if we are in case of a) lets throw now so the developer knows that they need to migrate their
                // adapters.
                throw new TypeError('Invalid adapterId, it must be extensible.');
            }

            // Lets create a whole replacement for this adapter.
            wireAdapterMock = createWireAdapterMockClass(adapter);

            global.wireAdaptersRegistryHack.set(adapter, wireAdapterMock);
        }

        // we are entirely replacing the wire adapter with one that can be spied on.
        wire[adapterName].adapter = wireAdapterMock;
    });

    return originalRegisterDecorators(Ctor, decoratorsMeta);
}
