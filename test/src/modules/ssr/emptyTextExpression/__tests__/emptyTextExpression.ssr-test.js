/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { generateAndSnapshotMarkup } from '@lwc/ssr-snapshot-utils/src/ssr-snapshot-utils';
import EmptyTextExpression from 'ssr/emptyTextExpression';

it('renders a basic component with an empty text expression', () => {
    const { renderedComponent, snapshotHash } = generateAndSnapshotMarkup(
        'ssr-empty-text-expression',
        EmptyTextExpression,
        {},
    );

    expect(renderedComponent).toMatchSnapshot(snapshotHash);
});
