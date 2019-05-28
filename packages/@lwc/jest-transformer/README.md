# @lwc/jest-transformer

Compile Lightning web components for [Jest](https://facebook.github.io/jest/) tests.

## Requirements

-   Node >= 10
-   NPM 5.x
-   Yarn >= 1.0.0

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
