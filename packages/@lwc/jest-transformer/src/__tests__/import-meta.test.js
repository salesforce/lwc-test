/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const jestTransform = require('../index.js');

// const test = require('./utils/test-transform').test(require('../client-scoped-import'));

// const DEFAULT_FORM_FACTOR = 'Large';

const SOURCE_FILENAME = 'foo.js';
const IMPORT_META_SRC = `
import { LightningElement } from 'lwc';
export default class Foo extends LightningElement {
    connectedCallback() {
        if (import.meta.env.SSR) {
            doSomethingOnTheServer();
        } else {
            doSomethingOnTheClient();
        }
    }
}
`;

describe('jest transform', () => {
    it('replaces import.meta.env.SSR with false', () => {
        const { code } = jestTransform.process(IMPORT_META_SRC, SOURCE_FILENAME) ?? {};
        expect(code).toContain(`if (false) {`);
    });
});
