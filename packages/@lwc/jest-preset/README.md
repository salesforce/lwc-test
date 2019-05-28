# @lwc/jest-preset

Tools to assist with testing Lightning Web Components (LWC) with Jest. This project provides 2 services: preset Jest configuration for testing Lightning web components, and stubs for common external libraries used in Lightning web components.

## Usage

### Jest Preset Configuration

1. Install `@lwc/synthetic-shadow`. This is a polyfill for ShadowRoot that was tailor-made for LWC.

    `yarn add --dev @lwc/synthetic-shadow`

2. Use this project's preset config. This maps to the settings in `jest-preset.json`. Any settings added to your project's own `jest` config will take precedence to entries in the preset.

    ```json
    {
        "jest": {
            "preset": "@lwc/jest-preset"
        }
    }
    ```

3. Update the `moduleNameMapper` entry in your Jest config to point to where your LWC components live. For example, use the following to map all components in the `example` and `other` namespaces:

    ```json
    {
        "moduleNameMapper": {
            "^(example|other)/(.+)$": "<rootDir>/src/test/modules/$1/$2/$2"
        }
    }
    ```

4. Create a `__tests__` inside the bundle of the LWC component under test.
5. Create a new test file in `__tests__` that follows the naming convention `<js-file-under-test>.test.js`. See an example in this projects `src/test` directory.
6. Write and run the Jest tests!
