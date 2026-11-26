# @lwc/vitest-plugin

Vite/Vitest plugin that mocks `@salesforce/*` scoped imports for LWC unit tests.

It is the Vitest counterpart to the `@salesforce/*` mocking that `@lwc/jest-transformer`
performed under Jest. LWC compilation itself is handled separately by `@lwc/rollup-plugin`.

## Exports

-   `salesforceScopedImports()` mocks the `@salesforce/*` and `@label/` modules that `@lwc/jest-transformer` mocks.
-   `salesforceImportShape()` checks how those modules are imported, as `@lwc/jest-transformer` does:
    -   A mocked module must be imported as a default import, `import foo from '@salesforce/label/c.foo'`. Any other shape (`import { foo }`, `import * as foo`, `import foo, { bar }`, or a bare `import`) fails with Jest's message.
    -   Apex method imports (`@salesforce/apex/*`, `@salesforce/apexContinuation/*`) are not checked. As in Jest, the first local name is bound to the method mock whatever the shape, so `import { getData } from '@salesforce/apex/C.getData'` works.
    -   `export ... from`, dynamic `import()` and bare `@salesforce/apex` named imports are not checked.

`@lwc/vitest-preset` adds both. In a hand-built config, `salesforceImportShape()` must come after `lwc()` from `@lwc/rollup-plugin`, so it sees compiled JavaScript.
