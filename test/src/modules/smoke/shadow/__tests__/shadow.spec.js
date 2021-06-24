/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

describe('shadow DOM', () => {
    // Smoke test to check that we're running in the right shadow DOM mode
    if (global['lwc-jest'].nativeShadow) {
        it('should be using native shadow DOM', () => {
            // sniff for JSOM's ShadowRoot implementation
            expect(ShadowRoot.prototype.constructor.toString()).not.toContain(
                'function SyntheticShadowRoot'
            );
        });
    } else {
        // synthetic shadow
        it('should be using synthetic shadow DOM', () => {
            // sniff for @lwc/synthetic shadow
            expect(ShadowRoot.prototype.constructor.toString()).toContain(
                'function SyntheticShadowRoot'
            );
        });
    }
});
