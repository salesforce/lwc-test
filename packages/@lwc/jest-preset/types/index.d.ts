/* eslint-disable */
// Inspired by:
// - https://unpkg.com/browse/expect@29.6.2/build/index.d.ts
// - https://unpkg.com/browse/@testing-library/jest-dom@6.0.1/types/matchers.d.ts

import { type expect } from '@jest/globals';

interface LwcJestMatchers<E, R> {
    /**
     * @description
     * Assert that appending a custom element to the DOM causes an error to be thrown from that element's `connectedCallback`.
     * @example
     * expect(() => {
     *     document.body.appendChild(element);
     * }).toThrowInConnectedCallback('expected error message');
     * @see
     * [@lwc/jest-preset docs](https://github.com/salesforce/lwc-test/blob/master/packages/%40lwc/jest-preset/README.md#custom-matchers)
     */
    toThrowInConnectedCallback(expected?: unknown): R;

    /**
     * @description
     * Assert that appending a custom element to the DOM causes an error to be thrown from that element's `connectedCallback`.
     *
     * Equivalent to `toThrowInConnectedCallback`.
     * @example
     * expect(() => {
     *     document.body.appendChild(element);
     * }).toThrowErrorInConnectedCallback('expected error message');
     * @see
     * [@lwc/jest-preset docs](https://github.com/salesforce/lwc-test/blob/master/packages/%40lwc/jest-preset/README.md#custom-matchers)
     */
    toThrowErrorInConnectedCallback(expected?: unknown): R;
}

declare global {
    namespace jest {
        interface Matchers<R = void, T = {}>
            extends LwcJestMatchers<ReturnType<typeof expect.stringContaining>, R> {}
    }
}

declare module '@jest/expect' {
    export interface Matchers<R extends void | Promise<void>>
        extends LwcJestMatchers<ReturnType<typeof expect.stringContaining>, R> {}
}

export {};
