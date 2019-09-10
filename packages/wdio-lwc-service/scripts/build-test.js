/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/* eslint-disable lwc/no-async-await */
const rollup = require('rollup');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const replace = require('rollup-plugin-replace');
const lwcCompiler = require('@lwc/rollup-plugin');
const rollupCompatPlugin = require('rollup-plugin-compat');
const rollupItestResolver = require('./rollup/rollup-itest-resolver');
const templates = require('./rollup/rollup-itest-resolver/templates');
const globals = require('./rollup/globals');
const external = require('./rollup/external');

const banner = (`/**\n * Copyright (C) 2019 salesforce.com, inc.\n */\ntypeof process === 'undefined' && (process = { env: { NODE_ENV: 'dev' } });`);

module.exports = async function build(test, {
    isCompat, plugins = [], namespace, component,
}) {
    const { name, dir } = path.parse(test);
    const testDir = path.basename(dir);
    const rootDir = path.resolve();
    const relDir = path.relative(rootDir, dir);
    // This is very important to not compile other suites!
    var excludeTestDirs = glob.sync(`**/${testDir}/`, {
        cwd: rootDir,
        ignore: 'node_modules/**'
    }).filter(x => !x.includes(relDir)).map(x => `${x}**`);

    const bundle = await rollup.rollup({
        input: test,
        external,
        plugins: [
            rollupItestResolver(dir),
            lwcCompiler({
                rootDir,
                mapNamespaceFromPath: true,
                resolveFromPackages: true,
                exclude: excludeTestDirs,
            }),
            replace({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            }),
            isCompat && rollupCompatPlugin({ polyfills: false }),
        ].concat(plugins),
    });
    const buildDir = `../build/${namespace}-${component}/${name}`;
    const outputDir = path.join(__dirname, buildDir);
    fs.ensureDirSync(outputDir);

    fs.writeFileSync(
        path.join(outputDir, 'index.html'),
        templates.html(name, { isCompat }),
    );

    return bundle.write({
        file: path.join(outputDir, 'bundle.js'),
        format: 'iife',
        globals,
        banner
    });
};
