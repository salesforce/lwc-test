/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { createElement } from 'lwc';
import SimpleComponent from 'example/simpleComponent';
import { wireAdapter } from 'example/adapter';

afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

/**
 * Example method used in wire-service-jest-util
 * @param adapterId
 * @returns {{getLastConfig: (function(): *), emit: emit}}
 */
function registerTestAdapter(adapterId) {
    let lastConfig;
    const wiredEventTargets = [];

    const emit = (value) => {
        wiredEventTargets.forEach(wiredEventTarget => wiredEventTarget.emit(value));
    };

    const getLastConfig = () => {
        return lastConfig;
    };

    const add = (arr, item) => {
        const idx = arr.indexOf(item);
        if (idx === -1) {
            arr.push(item);
        }
    };

    const relatedAdapter = global.adapterIdToAdapterMockMap.get(adapterId);

    relatedAdapter.spyAdapter({
        createInstance(wiredEventTarget) {
            add(wiredEventTargets, wiredEventTarget);
        },
        connect(wiredEventTarget) {
            lastConfig = {};
            add(wiredEventTargets, wiredEventTarget);
        },
        update(wiredEventTarget, config) {
            lastConfig = config;
        },
        disconnect(wiredEventTarget) {
            lastConfig = undefined;
            const idx = wiredEventTargets.indexOf(wiredEventTarget);
            if (idx > -1) {
                wiredEventTargets.splice(idx, 1);
            }
        }
    });

    return {
        emit,
        getLastConfig
    };
}

const genericAdapter = registerTestAdapter(wireAdapter);

describe('example-simpleComponent', () => {
    describe('test that the synthetic-shadow is working in jsdom', () => {
        it('should render the component and query the shadow dom', () => {
            const element = createElement('example-simple-component', { is: SimpleComponent });
            document.body.appendChild(element);
            return Promise.resolve().then(() => {
                const simpleComponent = document.querySelector('example-simple-component');
                expect(simpleComponent).not.toBeNull();

                expect(document.querySelector('.text-content')).toBeNull();

                const paragraphWithText = simpleComponent.shadowRoot.querySelector('.text-content');
                expect(paragraphWithText).not.toBeNull();
            });
        });
    });

    describe('test a component with invalid wire-adapter is working in jsdom', () => {
        it('should render the component wired text', () => {
            const element = createElement('example-simple-component', { is: SimpleComponent });
            document.body.appendChild(element);
            return Promise.resolve().then(() => {
                const simpleComponent = document.querySelector('example-simple-component');
                const paragraphWithText = simpleComponent.shadowRoot.querySelector('.wired-text');
                expect(paragraphWithText.textContent).toBe('');

                genericAdapter.emit('some test value');
            }).then(() => {
                const simpleComponent = document.querySelector('example-simple-component');
                const paragraphWithText = simpleComponent.shadowRoot.querySelector('.wired-text');
                expect(paragraphWithText.textContent).toBe('some test value');
            });
        });
    });
});
