/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const test = require('./utils/test-transform').test(require('../site-scoped-import'));

const DEFAULT_ID = '005000000000000000';

describe('@salesforce/site/Id import', () => {
    test(
        'does default transformation',
        `
        import id from '@salesforce/site/Id';
    `,
        `
        let id;

        try {
          id = require("@salesforce/site/Id").default;
        } catch (e) {
          id = "${DEFAULT_ID}";
        }
    `,
    );

    test(
        'allows non-@salesforce/site/Id named imports',
        `
        import { otherNamed } from './something-valid';
        import id from '@salesforce/site/Id';
    `,
        `
        import { otherNamed } from './something-valid';
        let id;

        try {
          id = require("@salesforce/site/Id").default;
        } catch (e) {
          id = "${DEFAULT_ID}";
        }
    `,
    );

    test(
        'throws error if using named import',
        `
      import { id } from '@salesforce/site/Id';
  `,
        undefined,
        'Invalid import from @salesforce/site/Id',
    );

    test(
        'throws error if renamed default imports',
        `
      import { default as id } from '@salesforce/site/Id';
  `,
        undefined,
        'Invalid import from @salesforce/site/Id',
    );

    test(
        'throws error if renamed multiple default imports',
        `
      import { default as id, foo } from '@salesforce/site/Id';
  `,
        undefined,
        'Invalid import from @salesforce/site/Id',
    );
});

describe('@salesforce/site/activeLanguages import', () => {
    test(
        'does default transformation',
        `
    import activeLanguages from '@salesforce/site/activeLanguages';
`,
        `
    let activeLanguages;

    try {
      activeLanguages = require("@salesforce/site/activeLanguages").default;
    } catch (e) {
      activeLanguages = [{
        code: 'en-US',
        label: 'English (US)'
      }];
    }
`,
    );

    test(
        'allows non-@salesforce/site/activeLanguages named imports',
        `
    import { otherNamed } from './something-valid';
    import activeLanguages from '@salesforce/site/activeLanguages';
`,
        `
    import { otherNamed } from './something-valid';
    let activeLanguages;

    try {
      activeLanguages = require("@salesforce/site/activeLanguages").default;
    } catch (e) {
      activeLanguages = [{
        code: 'en-US',
        label: 'English (US)'
      }];
    }
`,
    );

    test(
        'throws error if using named import',
        `
    import { activeLanguages } from '@salesforce/site/activeLanguages';
`,
        undefined,
        'Invalid import from @salesforce/site/activeLanguages',
    );

    test(
        'throws error if renamed default imports',
        `
    import { default as activeLanguages } from '@salesforce/site/activeLanguages';
`,
        undefined,
        'Invalid import from @salesforce/site/activeLanguages',
    );

    test(
        'throws error if renamed multiple default imports',
        `
    import { default as activeLanguages, foo } from '@salesforce/site/activeLanguages';
`,
        undefined,
        'Invalid import from @salesforce/site/activeLanguages',
    );
});

describe('@salesforce/site/defaultLanguage import', () => {
    test(
        'does default transformation',
        `
    import defaultLanguage from '@salesforce/site/defaultLanguage';
`,
        `
        import defaultLanguage from '@salesforce/site/defaultLanguage';
`,
    );

    test(
        'allows non-@salesforce/site/defaultLanguages named imports',
        `
    import { otherNamed } from './something-valid';
    import defaultLanguage from '@salesforce/site/defaultLanguage';
`,
        `
        import { otherNamed } from './something-valid';
        import defaultLanguage from '@salesforce/site/defaultLanguage';
`,
    );
});
