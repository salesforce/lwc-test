/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * node:test in .mjs so Jest and the publish glob skip it; run: node --test <this file>.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { lwcModuleNameMapper } from '../index.js';

// The package directory. Targets point at real files in it, except the missing ones.
const rootDir = fileURLToPath(new URL('../..', import.meta.url));
const lwcJs = path.join(rootDir, 'src/lwc.js');
const setupJs = path.join(rootDir, 'src/setup.js');
const importer = fileURLToPath(import.meta.url);

// Like @lwc/rollup-plugin, this `resolve` returns an id for any path, whether or not the file
// exists, so only the plugin's own disk check can reject a target.
function fakeContext() {
    const calls = [];
    return {
        calls,
        async resolve(id, from, options) {
            calls.push({ id, options });
            return { id: path.resolve(path.dirname(from), id) };
        },
    };
}

// The id the plugin resolves `source` to when this file imports it, or null if it leaves it alone.
async function resolveWith(moduleNameMapper, source, context = fakeContext()) {
    const plugin = lwcModuleNameMapper({ moduleNameMapper, rootDir });
    const resolved = await plugin.resolveId.call(context, source, importer, {});
    return resolved?.id ?? null;
}

describe('lwcModuleNameMapper', () => {
    test('is a pre plugin', () => {
        assert.equal(lwcModuleNameMapper({ rootDir }).enforce, 'pre');
    });

    test('replaces the whole specifier with the target, filling in capture groups', async () => {
        const mapper = { '^stub/(\\w+)/(\\w+)$': '<rootDir>/$1/$2.js' };
        assert.equal(await resolveWith(mapper, 'stub/src/lwc'), lwcJs);
    });

    test('matches keys anywhere in the specifier', async () => {
        // A Vite regex alias would replace only `label/`: `@salesforce/<target>c.greeting`.
        const mapper = { 'label/': '<rootDir>/src/lwc.js' };
        assert.equal(await resolveWith(mapper, '@salesforce/label/c.greeting'), lwcJs);
    });

    test('uses the first matching key in insertion order', async () => {
        const lwcFirst = { '^x/': '<rootDir>/src/lwc.js', '^x/y$': '<rootDir>/src/setup.js' };
        const setupFirst = { '^x/y$': '<rootDir>/src/setup.js', '^x/': '<rootDir>/src/lwc.js' };
        assert.equal(await resolveWith(lwcFirst, 'x/y'), lwcJs);
        assert.equal(await resolveWith(setupFirst, 'x/y'), setupJs);
    });

    test('fails if the first matching key does not resolve, without trying later keys', async () => {
        const mapper = { '^x/': '<rootDir>/src/missing.js', '^x/y$': '<rootDir>/src/lwc.js' };
        await assert.rejects(resolveWith(mapper, 'x/y'), /Could not locate module x\/y mapped as:/);
    });

    test('replaces a leading <rootDir> with the given directory', async () => {
        const context = fakeContext();
        const mapper = { '^x$': '<rootDir>/../vitest-preset/src/./lwc.js' };
        assert.equal(await resolveWith(mapper, 'x', context), lwcJs);
        assert.equal(context.calls[0].id, lwcJs);
    });

    test('resolves other targets from the importer, as Jest does', async () => {
        const context = fakeContext();
        assert.equal(await resolveWith({ '^x$': '../lwc.js' }, 'x', context), lwcJs);
        assert.equal(context.calls[0].id, '../lwc.js');
    });

    test('uses the first array target that exists', async () => {
        const targets = [
            '<rootDir>/src/missing.js',
            '<rootDir>/src/lwc.js',
            '<rootDir>/src/setup.js',
        ];
        assert.equal(await resolveWith({ '^x$': targets }, 'x'), lwcJs);
    });

    test('fails if no array target exists, listing each one', async () => {
        const mapper = { '^x$': ['<rootDir>/missing-a.js', '<rootDir>/missing-b.js'] };
        await assert.rejects(resolveWith(mapper, 'x'), /missing-a\.js\n.*missing-b\.js/);
    });

    test('leaves specifiers that no key matches to the other plugins', async () => {
        const context = fakeContext();
        assert.equal(await resolveWith({ '^x$': '<rootDir>/src/lwc.js' }, 'y', context), null);
        assert.equal(context.calls.length, 0);
    });

    test('fills a capture group that did not match with an empty string', async () => {
        const mapper = { '^x/(y/)?(\\w+)$': '<rootDir>/src/$1$2.js' };
        assert.equal(await resolveWith(mapper, 'x/lwc'), lwcJs);
    });

    test('does not map a mapped target again', async () => {
        // Jest resolves targets without the mapper. This key also matches the target's path.
        const plugin = lwcModuleNameMapper({ moduleNameMapper: { lwc: lwcJs }, rootDir });
        const context = fakeContext();
        await plugin.resolveId.call(context, 'x/lwc', importer, {});
        const [nested] = context.calls;
        assert.equal(
            await plugin.resolveId.call(context, nested.id, importer, nested.options),
            null
        );
    });

    test('does not map test or setup files', async () => {
        // Vitest resolves them without an importer, which Vite passes on as <root>/index.html.
        const plugin = lwcModuleNameMapper({ moduleNameMapper: { lwc: lwcJs }, rootDir });
        plugin.configResolved({ root: rootDir });
        const testFile = path.join(rootDir, 'src/__tests__/lwc.vitest.test.js');
        const entry = path.join(rootDir, 'index.html');
        assert.equal(await plugin.resolveId.call(fakeContext(), testFile, entry, {}), null);
        // The same specifier imported from a module is mapped.
        assert.equal(
            (await plugin.resolveId.call(fakeContext(), testFile, importer, {})).id,
            lwcJs
        );
    });
});
