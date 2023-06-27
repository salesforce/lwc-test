/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement, LightningElement } from 'lwc';
import DynamicCmp from '../dynamicCmp';

describe('Dynamic components', () => {
    afterAll(() => {
        jest.clearAllMocks();
    })

    it('should render dynamically imported component', (done) => {
        const element = createElement('smoke-dynamic-import', { is: DynamicCmp });
        // uses moduleNameMapper module resolution
        element.moduleName = 'smoke/child';
        document.body.appendChild(element);

        setTimeout(() => {
            expect(element).toMatchSnapshot();
            done();
        });
    });

    describe('mocking dynamic component', () => {
        it('should render with non virtual mock', (done) => {
            const element = createElement('smoke-dynamic-import', { is: DynamicCmp });
            // virtual:false requires moduleName in jest.mock(moduleName,...) to go through module resolution
            // https://jestjs.io/docs/jest-object#jestmockmodulename-factory-options
            jest.mock('smoke/child', () => require('./mock').default, { virtual: false });
            element.moduleName = 'smoke/child';
            document.body.appendChild(element);

            setTimeout(() => {
                expect(element).toMatchSnapshot();
                done();
            });
        });

        it('should render with virtual mock ', (done) => {
            const element = createElement('smoke-dynamic-import', { is: DynamicCmp });
            // virtual:false does not require moduleName in jest.mock(moduleName,...) to go through module resolution
            // https://jestjs.io/docs/jest-object#jestmockmodulename-factory-options
            jest.mock('test/child', () => require('./mock').default, { virtual: true });
            element.moduleName = 'test/child';
            document.body.appendChild(element);

            setTimeout(() => {
                expect(element).toMatchSnapshot();
                done();
            });
        });

        it('should render default namespace and name when file path is nonconforming', (done) => {
            const element = createElement('smoke-dynamic-import', { is: DynamicCmp });
            element.moduleName = 'smoke/@component';
            document.body.appendChild(element);

            setTimeout(() => {
                expect(element).toMatchSnapshot();
                done();
            });
        })

        it('should throw when mocked class skips transformation', () => {
            const element = createElement('smoke-dynamic-import', { is: DynamicCmp });
            class Test extends LightningElement {}
            element.ctor = Test;

            expect(() => {
                document.body.appendChild(element);
            }).toThrow("Invalid LWC constructor");
        });
    });
});
