/* eslint-disable */
import 'vitest';

interface Constructable {
    new (...args: any[]): any;
}

interface LwcVitestMatchers<R = unknown> {
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
    toThrowInConnectedCallback(expected?: string | Constructable | RegExp | Error): R;

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
    toThrowErrorInConnectedCallback(expected?: string | Constructable | RegExp | Error): R;
}

// Vitest's `Assertion` and `ExpectStatic` both extend `Matchers`, so augmenting it
// covers `expect(fn).toThrowInConnectedCallback(...)`.
declare module 'vitest' {
    interface Matchers<T = any> extends LwcVitestMatchers<T> {}
}
