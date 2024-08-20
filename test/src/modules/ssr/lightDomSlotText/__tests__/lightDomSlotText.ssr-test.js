/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import {generateAndSnapshotMarkup} from '@lwc/ssr-snapshot-utils/src/ssr-snapshot-utils';
import LightDomSlotText from 'ssr/lightDomSlotText';

it('renders a basic component with light DOM slot with text node slotted', () => {
    const {renderedComponent, snapshotHash} = generateAndSnapshotMarkup('ssr-light-dom-slot-text', LightDomSlotText, {});

    expect(renderedComponent).toMatchSnapshot(snapshotHash);
});
