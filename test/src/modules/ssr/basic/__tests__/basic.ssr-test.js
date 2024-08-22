/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { generateAndSnapshotMarkup } from '@lwc/ssr-snapshot-utils/src/ssr-snapshot-utils';
import Basic from 'ssr/basic';

it('renders a basic component and saves formatted snapshot', () => {
    const { renderedComponent, snapshotHash } = generateAndSnapshotMarkup('x-basic', Basic, {
        msg: 'Hello world',
    });

    expect(renderedComponent).toMatchSnapshot(snapshotHash);
});

it('renders a basic component and saves inline formatted snapshot', () => {
    const { renderedComponent } = generateAndSnapshotMarkup('x-basic', Basic, {
        msg: 'Hello world',
    });

    expect(renderedComponent).toMatchInlineSnapshot(
        `<x-basic><template shadowrootmode="open"><style type="text/css">h1 {color: red;}</style><h1>Basic, Hello world</h1></template></x-basic>`,
    );
});

it('runs on node environment', () => {
    expect(() => document).toThrow();
});
