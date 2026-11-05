/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Regression guard for the preset's per-file isolation (pool: 'forks', isolate: true in
// lwcVitestConfig), paired with leakB.vitest.test.js: each file checks that it sees none of the
// other's state, then leaks its own. Both pass in any order while every test file gets its own
// process. Turning isolation off makes the second file fail:
//   npx vitest run --config test/vitest.config.mjs --no-isolate --no-file-parallelism smoke/isolation
// In the synthetic-shadow project setup.js fails first ("@lwc/synthetic-shadow is being loaded twice").
import { createElement, LightningElement, wire } from 'lwc';
import { leakAAdapter, probeFiles } from '../probe';

// Defining a component with @wire adds its adapter to the preset's @wire registry.
class Wired extends LightningElement {
    @wire(leakAAdapter) value;
}

describe('per-file isolation', () => {
    it('sees no state from another test file, then leaks its own', () => {
        expect({
            global: global.isolationProbe,
            moduleState: probeFiles,
            body: document.body.innerHTML,
            wireRegistry: [...global.wireAdaptersRegistryHack.keys()],
        }).toEqual({ global: undefined, moduleState: [], body: '', wireRegistry: [leakAAdapter] });

        // No cleanup on purpose.
        global.isolationProbe = 'leakA';
        probeFiles.push('leakA');
        document.body.appendChild(createElement('smoke-isolation-leak-a', { is: Wired }));
    });
});
