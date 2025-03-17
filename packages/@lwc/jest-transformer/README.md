# @lwc/jest-transformer

Compile Lightning web components for [Jest](https://facebook.github.io/jest/) tests.

## About Jest Transformers

[Jest transformers](https://jestjs.io/docs/en/configuration#transform-object-string-string) modify source files in preparation for tests based on regular expressions. See Jest docs for more information.

The transformer modules in this package allow LWC developers to test components that reference `@salesforce` modules by transforming those `import` statements into assignment statements that work outside of a Salesforce application container.

## Installation

`yarn add -D @lwc/jest-transformer`

## Usage

Update your `jest` config to point the transformer to this package:

```json
{
    "jest": {
        "moduleFileExtensions": ["js", "html"],
        "transform": {
            "^.+\\.(js|html|css)$": "@lwc/jest-transformer"
        }
    }
}
```

### SSR Transformer

For SSR testing, use the new transformer `@lwc/jest-transformer/ssr`, which compiles components to generate the compiled artifact used for SSR rendering.
