/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const path = require('path');
const templates = require('./templates');

module.exports = (dir) => ({
    name: 'rollup-itest-resolver',
    load(id) {
        if (id.includes(dir) && id.includes('.spec.js')) {
            const namespace = 'integration';
            const { base } = path.parse(id);
            const component = base.replace('.spec.js', '');
            return templates.app({ namespace, component });
        }
        return null;
    }
});
