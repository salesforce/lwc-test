/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { transformSync } from '@babel/core';
import presetTypeScript from '@babel/preset-typescript';
import syntaxDecorators from '@babel/plugin-syntax-decorators';
import syntaxClassProperties from '@babel/plugin-syntax-class-properties';

// Vite plugin that strips TypeScript types from .ts files while leaving LWC decorators
// (@api/@track/@wire) intact for the LWC compiler. Vite's esbuild lowers those decorators
// into runtime __decorate calls, which the compiler can't read, so esbuild must stay off
// for .ts. Config mirrors @lwc/jest-transformer's BABEL_TS_CONFIG.
export function lwcTypeScript() {
    return {
        name: 'lwc-vitest:typescript',
        enforce: 'pre',
        transform(code, id) {
            const [filepath] = id.split('?');
            if (!filepath.endsWith('.ts') || filepath.includes('/node_modules/')) {
                return null;
            }
            const result = transformSync(code, {
                filename: filepath,
                sourceMaps: true,
                babelrc: false,
                configFile: false,
                presets: [[presetTypeScript, { allowDeclareFields: true }]],
                plugins: [
                    syntaxClassProperties,
                    [syntaxDecorators, { decoratorsBeforeExport: true }],
                ],
            });
            return { code: result.code, map: result.map };
        },
    };
}
