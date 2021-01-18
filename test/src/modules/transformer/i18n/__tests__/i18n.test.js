/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { i18nValues } from '../i18n';

it.each(Object.entries(i18nValues))(
    '@salesforce/i18n/%s should be resolved as a default mock value',
    (_, value) => {
        expect(value).toBeDefined();
        expect(value).not.toEqual('');
    }
);
