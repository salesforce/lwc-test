/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import fs from 'node:fs';
import path from 'node:path';

// Marks the resolve of a mapped target: Jest resolves targets without the mapper.
const MAPPED = 'lwc-module-name-mapper';

// existsSync first: statSync throws on Vite's \0 virtual ids.
const isFile = (file) => fs.existsSync(file) && fs.statSync(file).isFile();

// Jest's replaceRootDirInPath: only a leading <rootDir> is replaced.
function replaceRootDir(target, rootDir) {
    if (!target.startsWith('<rootDir>')) {
        return target;
    }
    return path.resolve(rootDir, path.normalize(`./${target.slice('<rootDir>'.length)}`));
}

// Jest's moduleNameMapper as a Vite plugin. Vite's regex `resolve.alias` replaces only the part of
// a specifier that matched; Jest replaces the whole specifier with the target, filling in $1, $2...
// from the key's capture groups. Keys are unanchored regexes, the first key that matches (in
// insertion order) wins, and an array target uses the first path that exists.
export function lwcModuleNameMapper({ moduleNameMapper = {}, rootDir }) {
    const rules = Object.entries(moduleNameMapper).map(([key, target]) => ({
        key,
        regex: new RegExp(key),
        targets: [target].flat().map((t) => replaceRootDir(t, rootDir)),
    }));
    let entryImporter;
    return {
        name: 'lwc-module-name-mapper',
        enforce: 'pre',
        configResolved({ root }) {
            // The importer Vite passes when there is none, as for Vitest's test and setup files.
            entryImporter = path.join(root, 'index.html');
        },
        async resolveId(source, importer, options) {
            // Jest maps only imports: never test or setup files, and never a mapped target.
            if (importer === entryImporter || options?.custom?.[MAPPED]) {
                return null;
            }
            const rule = rules.find(({ regex }) => regex.test(source));
            if (!rule) {
                return null;
            }
            const match = source.match(rule.regex);
            const candidates = rule.targets.map((target) =>
                target.replaceAll(/\$(\d+)/g, (_, index) => match[Number(index)] || '')
            );
            for (const candidate of candidates) {
                const resolved = await this.resolve(candidate, importer, {
                    ...options,
                    skipSelf: true,
                    custom: { ...options?.custom, [MAPPED]: true },
                });
                // @lwc/rollup-plugin resolves any relative or absolute path, even a missing one, so
                // check the disk. Untag stylesheet ids first: lwcStylesheetIds renames .css to
                // .css.lwc.js. The importer is undefined when Vite resolves without one.
                if (
                    resolved &&
                    (isFile(resolved.id.split('?')[0].replace(/\.css\.lwc\.js$/, '.css')) ||
                        (importer && isFile(path.resolve(path.dirname(importer), candidate))))
                ) {
                    return resolved;
                }
            }
            // Like Jest, the first matching key is final: later keys (and the @salesforce/* mocks)
            // never get the specifier.
            throw new Error(
                `Could not locate module ${source} mapped as:\n${candidates.join('\n')}\n\n` +
                    `Please check the moduleNameMapper entry ${JSON.stringify(rule.key)}.`
            );
        },
    };
}
