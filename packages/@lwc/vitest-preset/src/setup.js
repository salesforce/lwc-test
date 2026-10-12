/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// Vitest runtime bootstrap for LWC — port of `@lwc/jest-preset/src/setup.js`.
// Load order is load-bearing: ARIA polyfill -> synthetic-shadow -> engine-dom.
import './aria-reflection-polyfill.js';

// synthetic-shadow patches the global ShadowRoot/EventTarget the engine captures at load;
// loading it twice corrupts those globals, so guard before the (dynamic) import.
if (
    ShadowRoot.prototype.constructor.toString().includes('function SyntheticShadowRoot') ||
    EventTarget.prototype.addEventListener.toString().includes('function patchedAddEventListener')
) {
    throw new Error(
        '@lwc/synthetic-shadow is being loaded twice. Please examine your vitest/jsdom configuration.'
    );
}
await import('@lwc/synthetic-shadow');

const { setFeatureFlag } = await import('@lwc/engine-dom');
setFeatureFlag('ENABLE_EXPERIMENTAL_SIGNALS', true);

// Custom matchers
await import('./matchers/expect-throw-in-connected-callback.js');
