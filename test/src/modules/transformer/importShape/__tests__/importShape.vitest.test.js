/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Vitest side of Jest's scoped-import shape check (jest-transformer transforms/utils.js getImportInfo).
import { vi } from 'vitest';
import { createElement } from 'lwc';
import { getData } from '@salesforce/apex/MyController.getData';
import ApexBraces from '../apexBraces/apexBraces';

it("rejects a wrong-shaped scoped import with Jest's exact message", async () => {
    await expect(import('../badLabel/badLabel')).rejects.toMatchObject({
        message: `Invalid import from @salesforce/label/c.foo. Only import the default using the following syntax: "import foo from '@salesforce/label/c.foo'".`,
    });
});

it('binds a braces Apex import to the method mock', async () => {
    expect(vi.isMockFunction(getData)).toBe(true);
    const element = createElement('x-apex-braces', { is: ApexBraces });
    await expect(element.load({ id: 1 })).resolves.toBeUndefined();
    expect(getData).toHaveBeenCalledWith({ id: 1 });
});
