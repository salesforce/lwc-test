const path = require('path');
const lwcCompiler = require('@lwc/rollup-plugin');
const replace = require('rollup-plugin-replace');
const copy = require('rollup-plugin-copy');
const { getModulePath } = require('lwc');

const isCompat = /^compat$/i.test(process.env.mode);
const fwEngine = getModulePath('engine', 'umd', isCompat ? 'es5' : 'es2017', 'dev');
const fwShadow = getModulePath('synthetic-shadow', 'umd', isCompat ? 'es5' : 'es2017', 'dev');
const globalModules = {
    lwc: 'LWC',
};

module.exports = {
    input: path.resolve('src/index.js'),
    external: id => id in globalModules,
    output: {
        file: path.resolve('build/app.js'),
        format: 'iife',
        globals: globalModules,
        sourcemap: !isCompat,
    },
    plugins: [
        lwcCompiler({
            rootDir: path.join(__dirname, 'src/modules'),
            sourcemap: !isCompat,
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
