/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { renderComponent } from 'lwc';
import Basic from '../basic';

it('renders a basic component and saves formatted snapshot', () => {
    const renderedComponent = renderComponent('resolver-basic', Basic, { msg: 'Hello world' });

    expect(renderedComponent).toMatchSnapshot();
});

it('renders a basic component and saves inline formatted snapshot', () => {
    const renderedComponent = renderComponent('resolver-basic', Basic, { msg: 'Hello world' });

    expect(renderedComponent).toMatchInlineSnapshot(`
        <resolver-basic>
          <template shadowroot="open">
            <h1>
              Basic, Hello world
            </h1>
          </template>
        </resolver-basic>
    `);
});

it('runs on node environment', () => {
    expect(() => document).toThrow();
});
