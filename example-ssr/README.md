# SSR component Unit test setup

To ensure high-quality rendering for both server and client, separate test suites are necessary:

-   **Server-side tests:** Focus on rendering components to static HTML on the server side. These tests are executed in a Node environment, ensuring that server-side logic works as expected without client-side DOM interactions.
-   **Client-side tests:** Validate how components behave post-hydration in a browser-like environment. These tests are executed using JSDOM to simulate browser behavior.

Combining these tests in the same suite is complex and increases maintenance efforts. By separating them, we ensure better test reliability and coverage.

## Jest configuration

Jest is the primary tool used for testing, and both "core" and "off-core" repositories rely on it for server-side and client-side tests. The test configuration differs for each environment.

### Server-side configuration

In server-side testing, we focus on generating static HTML on the server. Below is a sample configuration file for server-side testing:

`jest.ssr-server.config.js`

```js
module.exports = {
    displayName: 'Server-side rendering',
    preset: '@lwc/jest-preset/ssr-server',
    testMatch: ['**/*.ssr-server.(spec|test).(js|ts)'],
    collectCoverage: true,
    collectCoverageFrom: ['**/*.ssr-server.(spec|test).(js|ts)'],
};
```

### Client-side configuration

For client-side testing, we validate how the component behaves after the client-side hydration. Below is a sample configuration for client-side-rendering testing.

`jest.ssr-client.config.js`

```js
module.exports = {
    displayName: 'SSR with hydration',
    preset: '@lwc/jest-preset/ssr-for-hydration',
    testMatch: ['**/*.ssr-client.(spec|test).(js|ts)'],
    setupFilesAfterEnv: ['./jest.ssr-client.setup.js'],
    collectCoverage: true,
    collectCoverageFrom: ['**/*.ssr-client.(spec|test).(js|ts)'],
};
```

At present, hydration errors are tracked by monitoring the console.warn event.

`jest.ssr-client.setup.js`

```js
beforeEach(() => {
    // Spy on console.warn and intercept warnings
    jest.spyOn(console, 'warn').mockImplementation((message) => {
        if (message.includes('Hydration mismatch')) {
            throw new Error(`Test failed due to hydration mismatch: ${message}`);
        } else {
            // If it's not a hydration mismatch, print the warning as usual
            console.warn(message);
        }
    });
});

afterEach(() => {
    // Restore original console.warn after each test
    jest.restoreAllMocks();
});
```

### Main Jest configuration

The main Jest configuration file combines both server-side and client-side test setups using the "projects" feature in Jest.

```js
module.exports = {
    projects: ['<rootDir>/jest.ssr-server.config.js', '<rootDir>/jest.ssr-client.config.js'],
};
```

### Writing test

**Server-side snapshot generation** :
Server-side tests generate static HTML markup as snapshots. These snapshots are critical in verifying the consistency of server-rendered output.

-   Step 1: Run server-side tests to generate initial snapshots.
-   Step 2: When component changes occur, rerun side-server tests to identify markup changes. If discrepancies arise, the tests will fail.
-   Step 3: Update the snapshots once changes are confirmed valid.

**Hydration using snapshots** :
Client-side tests utilize server-side snapshots to validate the post-hydration behavior of components:

-   Read server-side-generated snapshots.
-   Insert the pre-rendered markup into the DOM.
-   Hydrate the component and validate its behavior in the client environment.

**Snapshot management** :

-   Snapshot hash: Every part of the snapshot associated with a table-driven test case is linked to a unique hash, generated from the component's tag name, properties, and state. This approach ensures the integrity between server-side and client-side tests by enabling precise comparisons during hydration, ensuring that each test case aligns with its expected rendered output.
-   Updating snapshots: After modifying a component, update the corresponding snapshot to ensure alignment with changes.

For more details about how snapshots are generated, updated, and how to use APIs like generateAndSnapshotMarkup and readSnapshotMarkup, refer to [ snapshot utils](../packages/@lwc/jest-ssr-snaphot-utils/README.md).
