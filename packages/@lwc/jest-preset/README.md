# @lwc/jest-preset

Tools to assist with testing Lightning Web Components (LWC) with Jest. This project provides: two jest presets covering project's base Jest configuration for testing Lightning web components rendered on the DOM/Server, and stubs for common external libraries used in Lightning web components.

## Usage

### Installation

```shell
yarn add --dev @lwc/jest-preset @lwc/compiler @lwc/engine-dom @lwc/engine-server @lwc/synthetic-shadow
```

If your project is using **Jest 28** and above, you will also need install `jest-environment-jsdom` separately:

```
yarn add --dev jest-environment-jsdom
```

### Configuration

`@lwc/jest-preset` comes with two presets: `@lwc/jest-preset` (default) and `@lwc/jest-preset/ssr` used to test how a LWC component renders on the dom, and the server.

#### Testing LWC components rendered on the DOM

To test how LWC components render in the DOM, add the `@lwc/jest-preset` preset to your [jest configuration](https://jestjs.io/docs/configuration):

```json
{
    "preset": "@lwc/jest-preset"
}
```

Then, update the [`moduleNameMapper`](https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring) entry of the Jest config to point to where your LWC components live. For example, use the following to map all components in the `example` and `other` namespaces:

```json
{
    "preset": "@lwc/jest-preset",
    "moduleNameMapper": {
        "^(example|other)/(.+)$": "<rootDir>/src/test/modules/$1/$2/$2"
    }
}
```

##### nativeShadow

By default, this preset is configured to run the tests with synthetic shadow DOM. Optionally, you can configure `@lwc/jest-preset` to use native shadow DOM rather than synthetic shadow DOM. To do so, add the following to `jest.config.js`:

```json
{
    "globals": {
        "lwc-jest": {
            "nativeShadow": true
        }
    }
}
```

#### LWC components rendered on the Server

Add the `@lwc/jest-preset/ssr` preset to the Jest configuration like so:

```json
{
    "preset": "@lwc/jest-preset/ssr"
}
```

#### LWC DOM and SSR component test setup

Jest config only allows one preset per configuration. In order to allow client and server jest tests to live alongside, you might consider creating a new configuration.

Example: Use `jest.config.js` for DOM tests (`@lwc/jest-preset`) and create `jest-ssr.config.js` for server tests (`@lwc/jest-preset/ssr`); then add a `test:unit:ssr` script to your `package.json` to run jest with the [`--config` option](https://jestjs.io/docs/cli#--configpath)

```json
{
    "scripts": {
        "test:unit": "jest",
        "test:unit:ssr": "jest --config=jest-ssr.config.js"
    }
}
```

`jest.config.js` (DOM tests):

```js
module.exports = {
    preset: '@lwc/jest-preset',
    moduleNameMapper: {
        '^(example|other)/(.+)$': '<rootDir>/src/test/modules/$1/$2/$2',
    },
};
```

`jest-ssr.config.js` (SSR tests):

```js
module.exports = {
    preset: '@lwc/jest-preset/ssr',
    moduleNameMapper: {
        '^(example|other)/(.+)$': '<rootDir>/src/test/modules/$1/$2/$2',
    },
};
```

### Testing

Create a `__tests__` inside the bundle of the LWC component under test.

Then, create a new test file in `__tests__` that follows the naming convention `<js-file-under-test>.test.js` for DOM tests and `<js-file-under-test>.ssr-test.js` for ssr tests. See an example in this projects `src/test` directory.

Now you can write and run the Jest tests!

### Custom matchers

This package contains convenience functions to help test web components, including Lightning Web Components.

Note that, for these matchers to work properly in TypeScript, you must import this package from your `*.spec.ts` files:

```js
import '@lwc/jest-preset';
```

#### expect().toThrowInConnectedCallback

Allows you to test for an error thrown by the `connectedCallback` of a web component. `connectedCallback` [does not necessarily throw errors synchronously](https://github.com/salesforce/lwc/pull/3662), so this utility makes it easier to test for `connectedCallback` errors.

##### Example

```js
// Component
export default class Throws extends LightningElement {
    connectedCallback() {
        throw new Error('whee!');
    }
}
```

```js
// Test
import { createElement } from 'lwc';

it('Should throw in connectedCallback', () => {
    const element = createElement('x-throws', { is: Throws });
    expect(() => {
        document.body.appendChild(element);
    }).toThrowErrorInConnectedCallback(/whee!/);
});
```

##### Error matching

The argument passed in to `toThrowInConnectedCallback` behaves the same as for [Jest's built-in `toThrow`](https://jestjs.io/docs/expect#tothrowerror):

-   Regular expression: error message matches the pattern.
-   String: error message includes the substring.
-   Error object: error message is equal to the message property of the object.
-   Error class: error object is instance of class.

##### Best practices

Note that, to avoid false positives, you should try to include _only_ the `document.body.appendChild` call inside of your callback; otherwise you could get a false positive:

```js
expect(() => {
    document.body.appendChild(elm);
    throw new Error('false positive!');
}).toThrowInConnectedCallback();
```

The above Error will be successfully caught by `toThrowInConnectedCallback`, even though it doesn't really occur in the `connectedCallback`.

##### Web component support

This matcher works both with LWC components and with non-LWC custom elements that use standard
`connectedCallback` semantics (e.g. [Lit](https://lit.dev/) or [vanilla](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)).

It also works with LWC components regardless of whether they use the standard `connectedCallback` or the legacy [synthetic lifecycle](https://github.com/salesforce/lwc/issues/3198) `connectedCallback`.

#### expect().toThrowErrorInConnectedCallback

Equivalent to `toThrowInConnectedCallback`.
