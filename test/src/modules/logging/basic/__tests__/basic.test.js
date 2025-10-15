/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { describe, it, test, expect } from '@jest/globals';
import { createElement } from 'lwc';
import Basic from 'logging/basic';

describe('@lwc/jest-reset - logging', () => {
    it('renders the basic component', () => {
        // Arrange
        const sut = createElement('x-basic', { is: Basic });
        sut.arr = ['a', { b: 5 }];

        // Act
        document.body.appendChild(sut);

        // Assert
        expect(document.body.querySelector('x-basic')).toBeInstanceOf(HTMLElement);
    });

    test('the logs should be displayed', () => {
        // Arrange
        const sut = createElement('x-basic', { is: Basic });
        sut.arr = ['a', { b: 5 }];

        // Act
        document.body.appendChild(sut);

        // Assert
        expect(document.body.querySelector('x-basic')).toBeInstanceOf(HTMLElement);
    });
});
