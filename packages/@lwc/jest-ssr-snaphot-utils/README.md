## @lwc/jest-ssr-snapshot-utils

Snapshot utilities for SSR (Server-Side Rendering) testing, including both server and client-side rendered (CSR) components.

### Snapshot Overriding and Hash Assignment

When generating a snapshot of a component's server-side rendered (SSR) markup, the process involves capturing the component's markup and associating it with a unique hash. This hash is generated based on the component's tag name, properties (optional), and state (optional). The generated hash acts as a unique identifier, ensuring that specific renderings of the component can be easily recognized and compared in future tests.

**Customer-Facing API**

-   `generateAndSnapshotMarkup` :
    The `generateAndSnapshotMarkup` function is responsible for rendering the markup of a specified component and generating a unique snapshot hash for that markup.

```js
/**
 * Renders the component's markup, captures it in a snapshot that has a unique snapshot hash.
 *
 * @param tagName - The name of the HTML tag or component.
 * @param Ctor - The constructor of the Lightning Web Component.
 * @param props - An object representing the properties of the component (default is an empty object).
 * @param state - An object representing the state of the component (default is an empty object).
 * @returns An object containing the rendered markup and the generated snapshot hash.
 */
export function generateAndSnapshotMarkup(
    tagName: string,
    Ctor: typeof LightningElement,
    props: Record<string, unknown> = {},
    state: Record<string, unknown> = {}
): { markup: string; snapshotHash: string } {
    const markup = lwcRenderComponent(tagName, Ctor as never, props);
    const snapshotHash = generateSnapshotHash(tagName, props, state);

    return { markup, snapshotHash };
}
```

### Snapshot Reading in CSR Tests

In CSR tests, snapshots are read by generating a hash based on the tag name, optional properties, and state. This hash should match the one used in SSR tests to ensure consistency. The corresponding markup for the hash is then retrieved from the snapshot file.

An example snapshot with its hash:

```js
exports[<commerce-action-button> should render on the server (props = {}): 539769067cb7d02e90265e292deb19e6209fcf9772291b58480290aaa2ce58eb 1] = `
<commerce-action-button class="lwc-2ao6ogd8jo4-host">...`;
```

**Customer-Facing API**

-   `readSnapshotMarkup` : The `readSnapshotMarkup` function reads the markup associated with a specific hash from the snapshot file. If the snapshot is not found, it throws an error.

```js
/**
 * Reads the content of a snapshot file and returns the value associated with a specific hash.
 * Throws an error if the snapshot with the specified hash is not found.
 *
 * @param tagName - The name of the HTML tag or component.
 * @param props - An object representing the properties of the component (default is an empty object).
 * @param state - An object representing the state of the component (default is an empty object).
 * @param testFilePath - The optional absolute path of the test file. If not provided, it will be retrieved from the global context.
 * @returns The markup associated with the given hash from the snapshot.
 * @throws Error if the snapshot with the specified hash is not found.
 */
export function readSnapshotMarkup(
    tagName: string,
    props: Record<string, unknown> = {},
    state: Record<string, unknown> = {},
    testFilePath?: string
): string {
    const testAbsPath = testFilePath || (global as any).testFilePath;
    if (!testAbsPath) {
        throw new Error('Test file path must be provided or available in the global context.');
    }

    const snapPath = findFileByPrefix(testAbsPath);
    const fileContent = readFileSync(snapPath, 'utf8');
    const snapshotHash = generateSnapshotHash(tagName, props, state);

    const regexPattern = `exports\\[\\\`[^\\\`]*${snapshotHash}[^\\\`]*\\\`] = \\\`([^\\\`]*)\\\`;`;
    const match = new RegExp(regexPattern).exec(fileContent);

    if (!match) {
        throw new Error(`Snapshot with hash ${snapshotHash} not found. Ensure the SSR tests have been run to generate the snapshot.`);
    }

    return match[1];
}
```

These utilities ensure consistent and reliable testing between SSR and CSR, providing a streamlined process for generating and validating snapshots based on a unique hash system.
