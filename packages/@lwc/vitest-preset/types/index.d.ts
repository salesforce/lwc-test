/* eslint-disable */
import 'vitest';
import type { ViteUserConfig } from 'vitest/config';

export interface LwcVitestOptions {
    /** Skip synthetic-shadow and run components in native shadow DOM. */
    nativeShadow?: boolean;
}

/** Vitest config for LWC; call as `lwcVitestConfig(import.meta.url)` from a vitest config. */
export declare function lwcVitestConfig(
    importMetaUrl: string,
    options?: LwcVitestOptions
): ViteUserConfig;
export default lwcVitestConfig;

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
    // Mirrors the `nativeShadow` option; read it with `inject('lwcNativeShadow')`.
    interface ProvidedContext {
        lwcNativeShadow: boolean;
    }
}
