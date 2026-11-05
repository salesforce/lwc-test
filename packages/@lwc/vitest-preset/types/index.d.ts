/* eslint-disable */
import 'vitest';
import type { Plugin, ViteUserConfig } from 'vitest/config';

/** Jest `moduleNameMapper` rules: regex keys, targets that can use `$1`, `$2`... and `<rootDir>`. */
export type ModuleNameMapper = Record<string, string | string[]>;

export interface LwcVitestOptions {
    /** Skip synthetic-shadow and run components in native shadow DOM. */
    nativeShadow?: boolean;
    /** Map imports as Jest's `moduleNameMapper` does; `<rootDir>` is the config's directory. */
    moduleNameMapper?: ModuleNameMapper;
}

/** Vitest config for LWC; call as `lwcVitestConfig(import.meta.url)` from a vitest config. */
export declare function lwcVitestConfig(
    importMetaUrl: string,
    options?: LwcVitestOptions
): ViteUserConfig;
export default lwcVitestConfig;

/**
 * The Vite plugin behind the `moduleNameMapper` option, for configs that build their own plugin
 * list. Put it before `salesforceScopedImports()`, or the `@salesforce/*` mocks win.
 */
export declare function lwcModuleNameMapper(options: {
    moduleNameMapper?: ModuleNameMapper;
    /** What `<rootDir>` in a target stands for. */
    rootDir: string;
}): Plugin;

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
