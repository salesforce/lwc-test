/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/*
 * salesforceImportShape(): Jest's getImportInfo check for mocked scoped imports, and Jest's Apex
 * binding rule. Calls the transform hook with Vite's own parser.
 * node:test in .mjs so Jest and the publish glob skip it; run: node --test <this file>.
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { parseAst } from 'vite';

import { salesforceImportShape } from '../index.js';

const plugin = salesforceImportShape();
const ID = '/r/modules/x/foo/foo.js';

// Jest's message from jest-transformer transforms/utils.js, written out rather than imported.
const jestMessage = (source) =>
    `Invalid import from ${source}. Only import the default using the following syntax: "import foo from '@salesforce/label/c.foo'".`;

// Vite's this.error(message, position) throws; keep the position so tests can check it.
class PluginError extends Error {
    constructor(message, position) {
        super(message);
        this.position = position;
    }
}
const context = {
    parse: (code) => parseAst(code),
    error(message, position) {
        throw new PluginError(message, position);
    },
};
const transform = (code, id = ID) => plugin.transform.call(context, code, id);

// One source per module Jest checks with getImportInfo.
const CHECKED = [
    '@salesforce/accessCheck/record.Account',
    '@salesforce/client/formFactor',
    '@salesforce/contentAssetUrl/foo',
    '@salesforce/customPermission/foo',
    '@salesforce/i18n/lang',
    '@salesforce/label/c.foo',
    '@label/c.foo',
    '@salesforce/messageChannel/foo__c',
    '@salesforce/resourceUrl/foo',
    '@salesforce/schema',
    '@salesforce/schema/Account.Name',
    '@salesforce/user/Id',
    '@salesforce/user/isGuest',
    '@salesforce/userPermission/foo',
    '@salesforce/site/Id',
    '@salesforce/site/activeLanguages',
    '@salesforce/site/defaultLanguages',
];

const WRONG_SHAPES = {
    named: (s) => `import { foo } from '${s}';`,
    namespace: (s) => `import * as foo from '${s}';`,
    'default plus named': (s) => `import foo, { bar } from '${s}';`,
    'named default': (s) => `import { default as foo } from '${s}';`,
    'bare import': (s) => `import '${s}';`,
};

describe('checked modules', () => {
    for (const source of CHECKED) {
        for (const [shape, write] of Object.entries(WRONG_SHAPES)) {
            test(`${shape} import from ${source} throws Jest's message`, () => {
                const prefix = `const a = 1;\n`;
                const code = `${prefix}${write(source)}\n`;
                assert.throws(() => transform(code), {
                    message: jestMessage(source),
                    position: prefix.length,
                });
            });
        }

        test(`default import from ${source} passes unchanged`, () => {
            assert.equal(transform(`import foo from '${source}';\nfoo;\n`), undefined);
        });
    }

    test('only the first wrong import is reported, as Babel stops at the first throw', () => {
        const code = `import { a } from '@salesforce/label/c.a';\nimport { b } from '@salesforce/label/c.b';`;
        assert.throws(() => transform(code), { message: jestMessage('@salesforce/label/c.a') });
    });
});

describe('Apex method imports', () => {
    for (const prefix of ['@salesforce/apex/', '@salesforce/apexContinuation/']) {
        const source = `${prefix}C.getData`;
        const cases = [
            [`import { getData } from '${source}';`, 'getData'],
            [`import * as getData from '${source}';`, 'getData'],
            [`import { default as getData } from '${source}';`, 'getData'],
            [`import getData, { other } from '${source}';`, 'getData'],
            [`import { getData as fetchData } from '${source}';`, 'fetchData'],
            [`import {\n    getData,\n    other,\n} from '${source}';`, 'getData'],
        ];

        for (const [code, name] of cases) {
            test(`${JSON.stringify(code)} binds ${name} to the default export`, () => {
                const input = `${code}\n${name}();\n`;
                const { code: output, map } = transform(input);
                assert.equal(map, null);
                assert.equal(output.length, input.length, 'no offset moves');
                assert.equal(output.split('\n').length, input.split('\n').length, 'no line moves');
                const [declaration] = parseAst(output).body;
                assert.equal(declaration.source.value, source);
                assert.deepEqual(
                    declaration.specifiers.map((s) => [s.type, s.local.name]),
                    [['ImportDefaultSpecifier', name]]
                );
                // The code after the import is untouched.
                assert.equal(output.slice(code.length), input.slice(code.length));
            });
        }

        test(`default import from ${prefix} is left alone`, () => {
            assert.equal(transform(`import getData from '${source}';`), undefined);
        });

        test(`bare import from ${prefix} is left alone`, () => {
            assert.equal(transform(`import '${source}';`), undefined);
        });
    }

    test('rewrites several Apex imports in one file', () => {
        const input = `import { a } from '@salesforce/apex/C.a';\nimport x from 'y';\nimport * as b from '@salesforce/apexContinuation/C.b';\n`;
        const { code } = transform(input);
        assert.deepEqual(
            parseAst(code).body.map((n) => n.specifiers.map((s) => [s.type, s.local.name])),
            [
                [['ImportDefaultSpecifier', 'a']],
                [['ImportDefaultSpecifier', 'x']],
                [['ImportDefaultSpecifier', 'b']],
            ]
        );
    });
});

describe('not checked, as in Jest', () => {
    const untouched = {
        'export from': `export { foo } from '@salesforce/label/c.foo';`,
        'export star from': `export * from '@salesforce/label/c.foo';`,
        'dynamic import()': `const m = import('@salesforce/label/c.foo');`,
        'bare @salesforce/apex named imports': `import { refreshApex, getSObjectValue } from '@salesforce/apex';`,
        'unknown site key': `import { foo } from '@salesforce/site/foo';`,
        'a module the plugin does not mock': `import { foo } from '@salesforce/featureFlag/foo';`,
        'a nested import string': `const s = "import { foo } from '@salesforce/label/c.foo'";`,
    };
    for (const [name, code] of Object.entries(untouched)) {
        test(name, () => {
            assert.equal(transform(code), undefined);
        });
    }
});

describe('skipped ids', () => {
    const bad = `import { foo } from '@salesforce/label/c.foo';`;
    const ids = {
        'virtual (\\0)': '\0salesforce:@salesforce/label/c.foo',
        node_modules: '/r/node_modules/pkg/index.js',
        '.html': '/r/modules/x/foo/foo.html',
        '.css': '/r/modules/x/foo/foo.css',
        '.css with a query': '/r/modules/x/foo/foo.css?scoped=true',
    };
    for (const [name, id] of Object.entries(ids)) {
        test(name, () => {
            assert.equal(transform(bad, id), undefined);
        });
    }

    test('a query on a .js id is checked against the path before the query', () => {
        assert.throws(() => transform(bad, `${ID}?v=1`), {
            message: jestMessage('@salesforce/label/c.foo'),
        });
    });

    test('.ts files are checked', () => {
        assert.throws(() => transform(bad, '/r/modules/x/foo/foo.ts'), {
            message: jestMessage('@salesforce/label/c.foo'),
        });
    });

    test('code without a scoped import is not parsed', () => {
        const parseless = { ...context, parse: () => assert.fail('parse should not run') };
        assert.equal(plugin.transform.call(parseless, `import x from 'y';`, ID), undefined);
    });
});
