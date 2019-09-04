const path = require('path');
const lwcCompiler = require('@lwc/rollup-plugin');
const replace = require('rollup-plugin-replace');
const copy = require('rollup-plugin-copy');

const isCompat = /^compat$/i.test(process.env.mode);
const fwEngine = require.resolve(`@lwc/engine/dist/umd/${isCompat ? 'es5' : 'es2017'}/engine.js`);
const fwShadow = require.resolve('@lwc/synthetic-shadow/dist/umd/es2017/shadow.js');

module.exports = {
    input: path.resolve('src/index.js'),
    output: {
        file: path.resolve('build/app.js'),
        format: 'iife',
        globals: {
            lwc: 'Engine'
        }
    },
    plugins: [
        lwcCompiler({
            resolveFromSource: true,
            resolveFromPackages: true,
        }),
        copy({
            targets: [
                { src: 'src/index.html', dest: 'build' },
                { src: path.join(fwEngine), dest: 'build' },
                { src: path.join(fwShadow), dest: 'build' },
            ],
            verbose: true
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
    ],
    watch: {
        exclude: ['node_modules/**'],
    },
};
