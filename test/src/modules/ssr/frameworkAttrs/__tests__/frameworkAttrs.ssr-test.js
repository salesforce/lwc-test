/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { renderAndHashComponent } from '@lwc/ssr-snapshot-utils/src/ssr-snapshot-utils';
import FrameworkAttrs from '../frameworkAttrs';

it('serializes component with framework-supplied attributes', () => {
    const { renderedComponent, snapshotHash } = renderAndHashComponent(
        'x-basic',
        FrameworkAttrs,
        {},
    );

    expect(renderedComponent).toMatchSnapshot(snapshotHash);
});
