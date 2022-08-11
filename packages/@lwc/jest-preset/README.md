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
    "preset": "@lwc/jest-preset",
    "moduleNameMapper": {
        "^(example|other)/(.+)$": "<rootDir>/src/test/modules/$1/$2/$2"
    }
};
```

`jest-ssr.config.js` (SSR tests):
```js
module.exports = {
    "preset": "@lwc/jest-preset/ssr",
    "moduleNameMapper": {
        "^(example|other)/(.+)$": "<rootDir>/src/test/modules/$1/$2/$2"
    }
};
```

### Testing

Create a `__tests__` inside the bundle of the LWC component under test.

Then, create a new test file in `__tests__` that follows the naming convention `<js-file-under-test>.test.js` for DOM tests and `<js-file-under-test>.ssr-test.js` for ssr tests. See an example in this projects `src/test` directory.

Now you can write and run the Jest tests!
