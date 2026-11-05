/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// Reads at call time, as components do, so a test can set process.env first.
export function readImportMeta() {
    return {
        DEV: import.meta.env.DEV,
        PROD: import.meta.env.PROD,
        MODE: import.meta.env.MODE,
        SSR: import.meta.env.SSR,
        custom: import.meta.env.LWC_TEST_IMPORT_META_ENV,
        url: import.meta.url,
    };
}
