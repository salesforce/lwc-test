/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { renderAndHashComponent } from '@lwc/ssr-snapshot-utils/src/ssr-snapshot-utils';
import FrameworkAttrsWithValue from '../frameworkAttrsWithValue';

it('serializes component with framework-supplied attributes with value', () => {
    const { renderedComponent, snapshotHash } = renderAndHashComponent(
        'x-basic',
        FrameworkAttrsWithValue,
        {},
    );

    expect(renderedComponent).toMatchSnapshot(snapshotHash);
});
