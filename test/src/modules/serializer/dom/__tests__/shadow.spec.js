/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

it('prints shadow tree', () => {
    const host = document.createElement('div');
    const root = host.attachShadow({ mode: 'open' });

    const child = document.createElement('span');
    child.textContent = 'In the shadow DOM';
    root.append(child);

    expect(host).toMatchSnapshot();
});

it('prints slotted content properly', () => {
    const host = document.createElement('div');
    const root = host.attachShadow({ mode: 'open' });

    const text = document.createTextNode('In the shadow DOM');
    const slot = document.createElement('slot');
    root.append(text, slot);

    const slotted = document.createElement('span');
    slotted.textContent = 'In the light DOM';
    host.append(slotted);

    expect(host).toMatchSnapshot();
});

it('prints shadow tree recursively', () => {
    const host = document.createElement('div');
    const root = host.attachShadow({ mode: 'open' });

    const topText = document.createTextNode('In the top shadow DOM');
    const innerHost = document.createElement('span');
    const innerRoot = innerHost.attachShadow({ mode: 'open' });
    root.append(topText, innerHost);

    const innerText = document.createTextNode('In the inner shadow DOM');
    innerRoot.append(innerText);

    expect(host).toMatchSnapshot();
});
