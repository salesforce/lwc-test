# @lwc/jest-ssr-preset

Tools to assist with testing Lightning Web Components (LWC) rendered on the server with Jest. This project provides 2 services: preset Jest configuration for testing Lightning web components, and stubs for common external libraries used in Lightning web components.

## Usage

### Installation

```shell
yarn add --dev @lwc/jest-ssr-preset @lwc/compiler @lwc/engine-server
```

### Configuration

Add the preset to your `jest.config.js` like so:

```json
{
    "jest": {
        "preset": "@lwc/jest-ssr-preset"
    }
}
```

Then, update the `moduleNameMapper` entry in `jest.config.js`(**_1_**) to point to where your LWC components live. For example, use the following to map all components in the `example` and `other` namespaces:

```json
{
    "moduleNameMapper": {
        "^(example|other)/(.+)$": "<rootDir>/src/test/modules/$1/$2/$2"
    }
}
```

**_1:_** Notice that a jest config only allows one preset per configuration. In order to allow client and server jest tests to live alongside, you might consider creating a new configuration, eg: create `jest-ssr.config.js` and run jest with the `--config` [option](https://jestjs.io/docs/cli#--configpath) to run ssr tests. 


### Testing

Create a `__tests__` inside the bundle of the LWC component under test.

Then, create a new test file in `__tests__` that follows the naming convention `<js-file-under-test>.ssr-test.js`. See an example in this projects `src/test/ssr` directory.

Now you can write and run the Jest tests using SSR!

### Notes

Wire adapters are not (currently) supported on the server, therefore no special support was added for [`@salesforce/wire-service-jest-util`](https://github.com/salesforce/wire-service-jest-util).
