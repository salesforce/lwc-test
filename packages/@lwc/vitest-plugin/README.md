# @lwc/vitest-plugin

Vite/Vitest plugin that mocks `@salesforce/*` scoped imports for LWC unit tests.

It is the Vitest counterpart to the `@salesforce/*` mocking that `@lwc/jest-transformer`
performed under Jest. LWC compilation itself is handled separately by `@lwc/rollup-plugin`.

> **Status:** skeleton. The scoped-import mock logic lands in a later story.
