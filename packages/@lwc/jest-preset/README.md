# @lwc/jest-preset

Tools to assist with testing Lightning Web Components (LWC) with Jest. This project provides 2 services: preset Jest configuration for testing Lightning web components, and stubs for common external libraries used in Lightning web components.

## Usage

### Installation

```shell
yarn add --dev @lwc/jest-preset @lwc/compiler @lwc/engine-dom @lwc/synthetic-shadow
```

### Configuration

Add the preset to your `jest.config.js` like so:

```json
{
    "jest": {
        "preset": "@lwc/jest-preset"
    }
}
```

Then, update the `moduleNameMapper` entry in `jest.config.js` to point to where your LWC components live. For example, use the following to map all components in the `example` and `other` namespaces:

```json
{
    "moduleNameMapper": {
        "^(example|other)/(.+)$": "<rootDir>/src/test/modules/$1/$2/$2"
    }
}
```

#### nativeShadow

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

### Testing

Create a `__tests__` inside the bundle of the LWC component under test.

Then, create a new test file in `__tests__` that follows the naming convention `<js-file-under-test>.test.js`. See an example in this projects `src/test` directory.

Now you can write and run the Jest tests!
