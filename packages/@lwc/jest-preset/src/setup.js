// Use the ShadowRoot prototype to cache the patched constructor from one JSDOM instance to another.
// Currently JSDOM reuse the same prototypes for the web interfaces, but created brand new
// constructor.
//
// Note: Once JSDOM starting creating brand new prototype per page, this technique will break.
// https://github.com/jsdom/jsdom/pull/2691
const shadowRootPrototype = ShadowRoot.prototype;

if (shadowRootPrototype.$constructorCache$ === undefined) {
    // We should ideally use getModulePath from the "lwc" package here but our resolver maps that
    // identifier to @lwc/engine!
    require('@lwc/synthetic-shadow/dist/synthetic-shadow.js');

    shadowRootPrototype.$constructorCache$ = {
        ShadowRoot: global.ShadowRoot,
        CustomEvent: global.CustomEvent,
        MutationObserver: global.MutationObserver,
    }
} else {
    const { ShadowRoot, CustomEvent, MutationObserver } = shadowRootPrototype.$constructorCache$;

    global.ShadowRoot = ShadowRoot;
    global.CustomEvent = CustomEvent;
    global.MutationObserver = MutationObserver;
}

// Provides temporary backward compatibility for wire-protocol reform: lwc > 1.5.0
global.adapterIdToAdapterMockMap = new Map();
let originalRegisterDecorators;

function createWireAdapterClass(baseAdapter) {
    const noopAdapter = {
        connect(){},
        update(){},
        disconnect(){},
    };
    const spies = [];

    return class WireAdapterMock {
        constructor(dataCallback) {
            this.originalAdapter = baseAdapter ? (new baseAdapter()) : noopAdapter;
            this._dataCallback = dataCallback;

            spies.forEach((spy) => spy.createInstance(this));
        }
        connect() {
            spies.forEach((spy) => spy.connect(this));
            this.originalAdapter.connect();
        }
        update(config) {
            spies.forEach((spy) => spy.update(this, config));
            this.originalAdapter.update(config);
        }
        disconnect() {
            spies.forEach((spy) => spy.disconnect(this));
            this.originalAdapter.disconnect();
        }
        emit(value) {
            this._dataCallback(value);
        }
        static spyAdapter(spy) {
            spies.push(spy);
        }
    }
}

function overriddenRegisterDecorators(Ctor, decoratorsMeta) {
    const wire = decoratorsMeta.wire || {};

    Object.keys(wire).forEach((adapterName) => {
        const adapter = wire[adapterName].adapter;

        if (!global.adapterIdToAdapterMockMap.has(adapter)) {
            // validate the adapter
            if (!Object.isExtensible(adapter)) {
                throw new TypeError('Invalid adapterId, it must be extensible');
            }

            let isValid = false;
            if (typeof adapter === "function") {
                // lets check, if it is a valid adapter
                try {
                    const adapterInstance = new adapter(()=>{});
                    isValid = typeof adapterInstance.connect === "function" &&
                        typeof adapterInstance.update === "function" &&
                        typeof adapterInstance.disconnect === "function";
                } catch (e) {
                    isValid = false;
                }
            }

            const originalAdapter = isValid ? adapter : null;

            const mockAdapter = createWireAdapterClass(originalAdapter);
            Object.defineProperty(adapter, 'adapter', {
                value: mockAdapter
            });

            global.adapterIdToAdapterMockMap.set(adapter, mockAdapter);
        }
    });

    originalRegisterDecorators(Ctor, decoratorsMeta);
}

function installRegisterDecoratorsTrap(lwc) {
    const originalDescriptor = Object.getOwnPropertyDescriptor(lwc, 'registerDecorators');

    if (originalDescriptor.value === overriddenRegisterDecorators) {
        return;
    }

    originalRegisterDecorators = originalDescriptor.value;

    const newDescriptor = {
        value: overriddenRegisterDecorators,
        enumerable: originalDescriptor.enumerable,
        writable: originalDescriptor.writable,
        configurable: originalDescriptor.configurable,
    };

    Object.defineProperty(lwc, 'registerDecorators', newDescriptor);
}

const lwc = require('@lwc/engine');

installRegisterDecoratorsTrap(lwc);
