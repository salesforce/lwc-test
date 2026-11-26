/*
 * Copyright (c) 2026, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// vi.mock() on an Apex method that is imported with braces: the override must reach the component.
import { vi } from 'vitest';
import { createElement } from 'lwc';
import { getData } from '@salesforce/apex/MyController.getData';
import ApexBraces from '../apexBraces/apexBraces';

vi.mock('@salesforce/apex/MyController.getData', () => ({
    default: vi.fn(() => Promise.resolve('mocked')),
}));

it('uses the vi.mock override', async () => {
    const element = createElement('x-apex-braces', { is: ApexBraces });
    await expect(element.load()).resolves.toBe('mocked');
    expect(getData).toHaveBeenCalledTimes(1);
});
