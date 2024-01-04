/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const test = require('./utils/test-transform').test(require('../import-meta'));

describe('import.meta properties', () => {
    test(
        'does default transformation',
        `
        if (import.meta.url.startsWith('/test/')) {}
        `,
        `
        if (process.url.startsWith('/test/')) {}
        `,
    );

    test(
        'does env transformation inside IfStatement',
        `
        !import.meta.env.SSR ? doCsr() : doSsr();
        `,
        `
        !/true/i.test(process.env['SSR']) ? doCsr() : doSsr();
        `,
    );

    test(
        'does env transformation inside ConditionalExpression',
        `
        import.meta.env.SSR ? doCsr() : doSsr();
        `,
        `
        /true/i.test(process.env['SSR']) ? doCsr() : doSsr();
        `,
    );

    test(
        'does not transform new.target',
        `
        function Foo() {
          console.log(new.target);
        }
        `,
        `
        function Foo() {
          console.log(new.target);
        }
        `,
    );
});
