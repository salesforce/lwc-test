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
