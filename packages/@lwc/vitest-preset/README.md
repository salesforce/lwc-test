# @lwc/vitest-preset

Vitest preset configuration and setup files to help test Lightning Web Components.

It is the Vitest counterpart to `@lwc/jest-preset`: `lwcVitestConfig()` assembles a
Vitest configuration (LWC compilation via `@lwc/rollup-plugin`, the `@salesforce/*`
mock plugin `@lwc/vitest-plugin`, a jsdom environment, snapshot serialization, and
setup files), and `@lwc/vitest-preset/setup` provides the LWC test setup.

> **Status:** skeleton. The configuration and setup logic land in later stories.
