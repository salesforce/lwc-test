/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import semver from 'semver'
import { version as jestVersion } from 'jest/package.json'

const jestMajorVersion = semver.major(jestVersion)

// These snapshots differ between Jest <=28 and Jest 29+. It's not really feasible to maintain snapshots
// for multiple Jest versions, since Jest will complain about any obsolete snapshots.
// So we test only in Jest 29. For earlier versions of Jest, these are only tested in CI, and we can
// ignore Jest's warnings in that case.
if (jestMajorVersion >= 29) {
    it.each([
        ['undefined', undefined],
        ['null', null],
        ['empty object', {}],
        ['without the nodeType property', { anotherKindOfProperty: 5 }],
        ['with an element node type', document.createElement('div')],
        ['with a text node type', document.createTextNode('')],
        ['with a comment node type', document.createComment('')],
        ['with another kind of node type', document.createAttribute('foo')],
    ])('should return the expected state when we have %s', (useCase, input) => {
        expect(input).toMatchSnapshot();
    });
}
