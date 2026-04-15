/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/**
 * Extracts the namespace from file path
 * Handles patterns like:
 *      - modules/{namespace}/{component}/{component}.js
 *      - modules/{namespace}/{component}/__tests__/...
 *      - jest-modules/{namespace}/{component}/{component}.js
 * Returns 'x' as fallback if the namespace cannot be determined
 * @param {string} filePath
 * @returns {string}
 */
function extractNamespace(filePath) {
    const normalizedPath = filePath.replace(/\\/g, '/');

    // Match patterns: modules/{namespace} or jest-modules/{namespace}
    const match = normalizedPath.match(/(?:^|\/)(modules|jest-modules)\/([^/]+)\//);

    if (match && match[2]) {
        return match[2];
    }

    // Fallback to 'x', which was previously the default
    return 'x';
}

module.exports = { extractNamespace };
