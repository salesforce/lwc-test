/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { describe, it, test, expect, jest, afterEach } from '@jest/globals';
import { createElement } from 'lwc';
import Basic from 'logging/basic';

const featureEnabled = global['lwc-jest']?.loggingFormatter ? test : test.skip;
const featureDisabled = global['lwc-jest']?.loggingFormatter ? test.skip : test;

function prepare() {
    if (console._buffer) {
        // From https://github.com/jestjs/jest/blob/main/packages/jest-console/src/BufferedConsole.ts
        console._buffer.length = 0;
    }

    if (console._stdout) {
        jest.spyOn(console._stdout, 'write'); // From https://github.com/jestjs/jest/blob/main/packages/jest-console/src/CustomConsole.ts
    }
}

function getLastLog() {
    if (console._buffer) {
        return console._buffer[0]?.message;
    }

    return console._stdout.write.mock.calls[1][0];
}

describe('@lwc/jest-reset - logging', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('renders the basic component', () => {
        // Arrange
        const sut = createElement('x-basic', { is: Basic });
        sut.arr = ['a', { b: 5 }];

        // Act
        document.body.appendChild(sut);

        // Assert
        expect(document.body.querySelector('x-basic')).toBeInstanceOf(HTMLElement);
    });

    featureDisabled('the logs should be displayed but not gracefully', () => {
        // Arrange
        prepare();

        const sut = createElement('x-basic', { is: Basic });
        sut.arr = ['a', { b: 5 }];

        // Act
        document.body.appendChild(sut);

        // Assert
        expect(getLastLog().includes('Received arr: []')).toBeTruthy();
    });

    featureEnabled('the logs should be displayed gracefully', () => {
        // Arrange
        prepare();

        const sut = createElement('x-basic', { is: Basic });
        sut.arr = ['a', { b: 5 }];

        // Act
        document.body.appendChild(sut);

        // Assert
        expect(getLastLog().includes(`Received arr: [ 'a', { b: 5 } ]`)).toBeTruthy();
    });
});
