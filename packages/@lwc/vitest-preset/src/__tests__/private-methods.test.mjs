/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * node:test in .mjs so Jest and the publish glob skip it; run: node --test <this file>.
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { lwcVitestConfig } from '../index.js';
import { allowsPrivateMethods } from '../private-methods.js';

describe('allowsPrivateMethods', () => {
    // Answers are what Jest gives for the same paths: the first modules/<namespace>/ decides.
    const cases = [
        ['/r/modules/lightning/a/a.js', true],
        ['/r/modules/interop/a/a.js', true],
        ['/r/jest-modules/lightning/a/a.js', true],
        ['/r/jest-modules/interop/a/a.js', true],
        ['modules/lightning/a/a.js', true],
        ['C:\\r\\modules\\lightning\\a\\a.js', true],
        ['/r/modules/smoke/a/a.js', false],
        ['/r/modules/c/lightning/a.js', false],
        ['/r/modules/Lightning/a/a.js', false],
        ['/r/foomodules/lightning/a/a.js', false],
        ['/r/modules/lightning', false],
        ['/r/src/lightning/modules/a/a.js', false],
        ['/r/modules/modules/lightning/a/a.js', false],
        ['/me/modules/proj/src/modules/lightning/a/a.js', false],
        ['/me/jest-modules/proj/src/modules/interop/a/a.js', false],
    ];

    for (const [file, expected] of cases) {
        test(`${file} -> ${expected}`, () => {
            assert.equal(allowsPrivateMethods(file), expected);
        });
    }
});

describe('lwcVitestConfig private methods', () => {
    const source = `import { LightningElement } from 'lwc';
export default class Foo extends LightningElement {
    #secret() { return 1; }
    run() { return this.#secret(); }
}`;
    const compilers = lwcVitestConfig(import.meta.url).plugins.filter(
        (plugin) => plugin.name === 'rollup-plugin-lwc-compiler'
    );
    // Which of the two compiler instances took the file, and whether it compiled.
    const outcomes = (file) =>
        compilers.map((plugin) => {
            try {
                return plugin.transform.call({ warn() {} }, source, file) ? 'compiled' : 'skipped';
            } catch {
                return 'threw';
            }
        });

    test('only the instance with private methods on compiles lightning files', () => {
        assert.deepEqual(outcomes('/r/modules/lightning/a/a.js'), ['compiled', 'skipped']);
        assert.deepEqual(outcomes('/r/jest-modules/interop/a/a.js'), ['compiled', 'skipped']);
    });

    test('only the instance with private methods off takes other files, and rejects them', () => {
        assert.deepEqual(outcomes('/r/modules/smoke/a/a.js'), ['skipped', 'threw']);
        assert.deepEqual(outcomes('/me/modules/proj/src/modules/lightning/a/a.js'), [
            'skipped',
            'threw',
        ]);
    });
});
