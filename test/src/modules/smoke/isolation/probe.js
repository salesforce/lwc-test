/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// Shared helper for the leakA/leakB isolation probes.

// Module state: each probe file records itself here. A fresh module registry starts it empty.
export const probeFiles = [];

// One @wire adapter per probe file (the LWC compiler only accepts imported adapters), so the
// @wire registry shows which probe files ran in this process.
export const leakAAdapter = () => {};
export const leakBAdapter = () => {};
