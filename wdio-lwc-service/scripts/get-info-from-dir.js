/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
module.exports = (dir) => {
    let m;
    if ((m = dir.match(/([^-/]+)-([^/]+)\/[^/]+$/))) {
        // Standard: example-app/__wdio__/foo.spec.js
        return {
            namespace: m[1],
            component: m[2]
        };
    }
    if ((m = dir.match(/([^/]+)\/([^/]+)\/[^/]+$/))) {
        // Namespace: example/app/__wdio__/foo.spec.js
        return {
            namespace: m[1],
            component: m[2]
        };
    }
    throw new Error('Invalid spec directory structure.');
};
