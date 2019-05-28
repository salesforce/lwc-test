# @lwc/jest-transformer

Compile Lightning web components for [Jest](https://facebook.github.io/jest/) tests.

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
