# @lwc/vitest-preset

Vitest configuration and setup for testing Lightning Web Components (LWC). It is the Vitest counterpart to [`@lwc/jest-preset`](https://github.com/salesforce/lwc-test/blob/master/packages/%40lwc/jest-preset/README.md).

`lwcVitestConfig()` returns a Vitest config that:

-   compiles component `.js`, `.ts`, `.html` and `.css` files with `@lwc/rollup-plugin`, using the same compiler options as `@lwc/jest-transformer`
-   mocks `@salesforce/*` scoped imports with `@lwc/vitest-plugin`
-   runs tests in jsdom at `http://localhost/`, as Jest does
-   loads synthetic shadow DOM, the LWC engine and the custom matchers before each test file

## Usage

### Installation

```shell
yarn add --dev @lwc/vitest-preset vitest jsdom @lwc/engine-dom @lwc/synthetic-shadow @lwc/rollup-plugin @lwc/wire-service
```

-   Install `@lwc/rollup-plugin` at the same version as `@lwc/engine-dom`. Otherwise the engine warns that components were compiled by a different compiler version.
-   `@lwc/rollup-plugin` looks up `@lwc/wire-service` whenever it resolves a namespace import such as `x/child`, so install it even if you don't use it.
-   Requires Node 20+, Vitest 4.1+ and LWC 9.1.1+.

### Configuration

Create a `vitest.config.mjs`:

```js
import { defineConfig } from 'vitest/config';
import { lwcVitestConfig } from '@lwc/vitest-preset';

export default defineConfig(lwcVitestConfig(import.meta.url));
```

`import.meta.url` makes the config's directory the project root. Tests are picked up from `**/__tests__/**/*.vitest.test.{js,ts}`.

Each test file runs in its own forked process with a fresh module registry (`pool: 'forks'`, `isolate: true`), as in Jest.

Setting `isolate: false` (or a pool other than `forks`) in your config overrides this and is **not supported**: module state such as synthetic shadow and the `@wire` registry would leak between files.

Namespace imports (`import Child from 'x/child'`, or `<x-child>` in a template) are resolved with the standard LWC module config. Point it at your components in an `lwc.config.json` next to the Vitest config, or in an `lwc` key in `package.json`:

```json
{
    "modules": [{ "dir": "src/modules" }]
}
```

This replaces the `moduleNameMapper` entry used with `@lwc/jest-preset`.

#### nativeShadow

Tests run with synthetic shadow DOM by default. To use native shadow DOM instead:

```js
export default defineConfig(lwcVitestConfig(import.meta.url, { nativeShadow: true }));
```

Tests can read the mode with `inject('lwcNativeShadow')` from `vitest`. There is no `global['lwc-jest']` under Vitest.

To run the same tests in both modes, add one project per mode. Each project needs a unique name:

```js
import { defineConfig } from 'vitest/config';
import { lwcVitestConfig } from '@lwc/vitest-preset';

function project(nativeShadow) {
    const config = lwcVitestConfig(import.meta.url, { nativeShadow });
    config.test.name = nativeShadow ? 'native shadow' : 'synthetic shadow';
    return config;
}

export default defineConfig({
    test: { projects: [project(false), project(true)] },
});
```

### Custom matchers

`expect().toThrowInConnectedCallback()` and its alias `toThrowErrorInConnectedCallback()` are registered automatically and typed for TypeScript. They behave as they do in [`@lwc/jest-preset`](https://github.com/salesforce/lwc-test/blob/master/packages/%40lwc/jest-preset/README.md#custom-matchers).

## Differences from `@lwc/jest-preset`

-   **No snapshot serializer yet.** Snapshots don't go through `@lwc/jest-serializer`.
-   **Component names come from the file path.** `@lwc/jest-transformer` compiles every component as `x-test`. Here a component keeps its real name (for example `smoke-mixin`), so tag names and CSS scope tokens differ.
-   **No SSR preset.** There is no counterpart to `@lwc/jest-preset/ssr`.
-   **`import.meta` is not rewritten.** `@lwc/jest-transformer` turns every `import.meta.env.X` into a boolean. Vitest keeps the real `import.meta`. See [`import.meta`](#importmeta).

### `import.meta`

Under Jest, `import.meta.env.X` is `true` only when `process.env.X` matches `/true/i`, and `import.meta.url` is `undefined`. Under Vitest, `DEV` is `true`, `PROD` is `false`, `SSR` is `false` (`true` in a `node` environment), `MODE` is `'test'`, any other key is the raw `process.env` string, and `import.meta.url` is the module's `file://` URL. So string comparisons such as `import.meta.env.X === 'false'` behave differently.

Both runners read `process.env` when the code runs, but they convert `SSR` differently:

| `process.env.SSR`                 | Jest    | Vitest  |
| --------------------------------- | ------- | ------- |
| `'true'`                          | `true`  | `true`  |
| `'1'`                             | `false` | `true`  |
| `'false'`, `false` or `undefined` | `false` | `true`  |
| `''` or deleted                   | `false` | `false` |

-   To turn SSR on in a test, use `vi.stubEnv('SSR', true)` and undo it with `vi.unstubAllEnvs()`. Setting `process.env.SSR = 'true'` and then `delete process.env.SSR` also works, under both runners.
-   Never turn SSR off with `'false'`, `false` or `undefined`. Vitest reads all three as `true`.
-   Don't set `SSR` in `test.env`. Vitest resets it from the test environment when the worker starts. Set it in a setup file instead. Use a setup file too when a module reads `import.meta.env.SSR` at the top level, because the value is captured when the module is imported.
-   Jest only rewrites dot access (`import.meta.env.X`). Computed access, optional chaining and destructuring only work under Vitest.
