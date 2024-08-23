/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
module.exports = function ({ types: t }) {
    let currentMemberExpressions = new Set();

    return {
        visitor: {
            MemberExpression: {
                enter(path) {
                    currentMemberExpressions.add(path);
                },
                exit(path) {
                    currentMemberExpressions.delete(path);
                },
            },
            MetaProperty(path) {
                // Jest is not able to handle `import.meta` properties , so we need to transform
                // these into `process.env` equivalents.
                const { parent } = path;
                if (
                    t.isMemberExpression(parent) &&
                    t.isIdentifier(parent.property) &&
                    path.node.meta.name === 'import' &&
                    path.node.property.name === 'meta'
                ) {
                    if (parent.property.name === 'env') {
                        // `import.meta.env.*` properties require some special treatment. Unfortunately
                        // `process.env` only supports `string` properties, which means that `boolean`
                        // environmental information e.g. `import.meta.env.SSR` do not work as expected
                        // out-of-the-box without some extra "massaging".
                        const envPath = Array.from(currentMemberExpressions.values()).at(-2);
                        const envName = envPath?.get?.('property.name')?.node;
                        envPath?.replaceWithSourceString?.(
                            `/true/i.test(process.env['${envName}'])`
                        );
                    } else {
                        // Transform e.g. `import.meta.url` with `process.url`
                        path.replaceWithSourceString('process');
                    }
                }
            },
        },
    };
};
