/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// Jest's rule (@lwc/jest-transformer extractNamespace): the first modules/<namespace>/ in the path decides.
export function allowsPrivateMethods(file) {
    const match = file.replace(/\\/g, '/').match(/(?:^|\/)(?:modules|jest-modules)\/([^/]+)\//);
    return ['lightning', 'interop'].includes(match?.[1]);
}

// The plugin's enablePrivateMethods is global, so run one instance per value; each compiles only its files.
export function forPrivateMethods(plugin, enabled) {
    const { transform } = plugin;
    return {
        ...plugin,
        transform(src, id) {
            const [file] = id.split('?');
            return allowsPrivateMethods(file) === enabled ? transform.call(this, src, id) : null;
        },
    };
}
