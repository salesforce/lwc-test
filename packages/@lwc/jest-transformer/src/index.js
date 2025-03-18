/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const path = require('path');
const crypto = require('crypto');
const semver = require('semver');

const { isKnownScopedCssFile } = require('@lwc/jest-shared');

const MagicString = require('magic-string');
const babelCore = require('@babel/core');
const lwcCompiler = require('@lwc/compiler');
const { generateScopeTokens } = require('@lwc/template-compiler');
const jestPreset = require('babel-preset-jest');
const babelCommonJs = require('@babel/plugin-transform-modules-commonjs');
const babelDynamicImport = require('@babel/plugin-proposal-dynamic-import');
const babelClassProperties = require('@babel/plugin-syntax-class-properties');
const babelSyntaxDecorators = require('@babel/plugin-syntax-decorators');
const babelTsPreset = require.resolve('@babel/preset-typescript');

const compilerVersion = require('@lwc/compiler/package.json').version;

const apexScopedImport = require('./transforms/apex-scoped-import');
const apexContinuationScopedImport = require('./transforms/apex-continuation-scoped-import');
const customPermissionImport = require('./transforms/custom-permission-scoped-import');
const i18nScopedImport = require('./transforms/i18n-scoped-import');
const labelScopedImport = require('./transforms/label-scoped-import');
const resourceScopedImport = require('./transforms/resource-scoped-import');
const contentAssetUrlScopedImport = require('./transforms/content-asset-url-scoped-import');
const schemaScopedImport = require('./transforms/schema-scoped-import');
const userScopedImport = require('./transforms/user-scoped-import');
const userPermissionImport = require('./transforms/user-permission-scoped-import');
const clientScopedImport = require('./transforms/client-scoped-import');
const messageChannelScopedImport = require('./transforms/message-channel-scoped-import');
const accessCheck = require('./transforms/access-check-scoped-import');
const siteScopedImport = require('./transforms/site-scoped-import');
const importMeta = require('./transforms/import-meta');

const BABEL_TS_CONFIG = {
    sourceMaps: 'inline',
    babelrc: false,
    configFile: false,
    plugins: [
        babelClassProperties,
        [
            babelSyntaxDecorators,
            {
                decoratorsBeforeExport: true,
            },
        ],
    ],
    presets: [[babelTsPreset, { allowDeclareFields: true }]],
};

const BABEL_CONFIG = {
    sourceMaps: 'both',
    presets: [jestPreset],
    plugins: [
        babelDynamicImport,
        babelCommonJs,
        apexScopedImport,
        apexContinuationScopedImport,
        customPermissionImport,
        i18nScopedImport,
        labelScopedImport,
        contentAssetUrlScopedImport,
        resourceScopedImport,
        schemaScopedImport,
        userScopedImport,
        userPermissionImport,
        clientScopedImport,
        messageChannelScopedImport,
        accessCheck,
        siteScopedImport,
        importMeta,
    ],
};

function isTypeScript(filePath) {
    return path.extname(filePath) === '.ts';
}

function transformTypeScript(src, filePath) {
    const { code } = babelCore.transform(src, {
        ...BABEL_TS_CONFIG,
        filename: filePath,
    });
    return code;
}

function transformLWC(src, filePath, isSSR) {
    if (isTypeScript(filePath)) {
        src = transformTypeScript(src, filePath);
    }

    // Set default module name and namespace value for the namespace because it can't be properly guessed from the path
    const compilerOptions = {
        name: 'test',
        namespace: 'x',
        outputConfig: {
            sourcemap: true,
        },
        experimentalDynamicComponent: {
            strictSpecifier: false,
        },
        scopedStyles: isKnownScopedCssFile(filePath),
        enableDynamicComponents: true,
        /**
         * Prevent causing tons of warning log lines.
         * @see {@link https://github.com/salesforce/lwc/pull/3544}
         * @see {@link https://github.com/salesforce/lwc/releases/tag/v2.49.1}
         */
        ...(semver.lt(compilerVersion, '2.49.1') ? { enableLwcSpread: true } : {}),
    };
    const ssrMode = process.env.LWC_SSR_MODE || 'v2';
    if (isSSR) {
        if (ssrMode !== 'v1') {
            compilerOptions.targetSSR = true;
            compilerOptions.ssrMode = 'sync';
        }
    }

    const { code, map, warnings } = lwcCompiler.transformSync(src, filePath, compilerOptions);
    const cssScopeTokens = filePath.endsWith('.html')
        ? generateScopeTokens(filePath, 'x', 'test').cssScopeTokens
        : undefined;

    // Log compiler warnings, if any
    if (warnings && warnings.length > 0) {
        warnings.forEach((warning) => {
            console.warn(`\x1b[33m[LWC Warn]\x1b[0m(${filePath}): ${warning?.message ?? warning}`);
        });
    }
    // if is not .js, we add the .compiled extension in the sourcemap
    const filename = path.extname(filePath) === '.js' ? filePath : filePath + '.compiled';
    // **Note: .html and .css don't return valid sourcemaps cause they are used for rollup
    const config = map && map.version ? { inputSourceMap: map } : {};

    let result = babelCore.transform(code, { ...BABEL_CONFIG, ...config, filename });

    if (cssScopeTokens) {
        // Modify the code so that it calls into @lwc/jest-shared and adds the scope token as a
        // known scope token so we can replace it later.
        // Note we have to modify the code rather than use @lwc/jest-shared directly because
        // the transformer does not run in the same Node process as the serializer.
        const magicString = new MagicString(result.code);

        // lwc-test may live in a different directory from the component module code, so
        // we need to provide an absolute path
        const jestSharedPath = require.resolve('@lwc/jest-shared');

        magicString.append(
            `\nconst { addKnownScopeToken } = require(${JSON.stringify(jestSharedPath)});`
        );

        for (const scopeToken of cssScopeTokens) {
            magicString.append(`\naddKnownScopeToken(${JSON.stringify(scopeToken)});`);
        }

        const map = magicString.generateMap({
            source: filePath,
            includeContent: true,
        });

        const modifiedCode = magicString.toString() + `\n//# sourceMappingURL=${map.toUrl()}\n`;

        result = {
            ...result,
            code: modifiedCode,
            map,
        };
    }

    return result;
}
module.exports = {
    process(src, filePath) {
        return transformLWC(src, filePath, false);
    },

    getCacheKey(sourceText, sourcePath, ...rest) {
        let configString;
        let transformConfig;

        if (rest.length === 1) {
            transformConfig = rest[0];
            configString = transformConfig.configString;
        } else {
            throw new Error('Unexpected transform arguments.');
        }

        const { NODE_ENV } = process.env;

        return crypto
            .createHash('md5')
            .update(JSON.stringify(configString), 'utf8')
            .update(sourceText + sourcePath + configString + NODE_ENV + compilerVersion, 'utf8')
            .digest('hex');
    },
};

module.exports.transformLwc = transformLWC;
