# SSR Testing Strategy

## Introduction

The document outlines a comprehensive quality strategy, addressing all four quality quadrants, and serves as a foundational guide for feature teams working with SSR-enabled components. It provides best practices, tools, and methodologies for ensuring high-quality output across different testing areas, including unit, functional, non-functional, and visual testing.

## Unit Testing

### Overview

This document outlines the strategy for unit testing in Server-side rendering and Client-side rendering environments. These distinct environments require separate test suites due to their unique configurations and functionalities. The testing approach ensures that both server-side and client-side rendering are thoroughly validated, leading to reliable and robust codebases.

### Test Suite Separation

To ensure high-quality rendering for both server and client, separate test suites are necessary:

-   **Server-side tests**: Focus on rendering components to static HTML on the server side. These tests are executed in a Node environment, ensuring that server-side logic works as expected without client-side DOM interactions.
-   **Client-side tests**: Validate how components behave post-hydration in a browser-like environment. These tests are executed using JSDOM to simulate browser behavior.

Combining these tests in the same suite is complex and increases maintenance efforts. By separating them, we ensure better test reliability and coverage.

### Required Dependencies

The following list of dependencies should be added (make sure to add the latest version):

1. `@lwc/jest-ssr-snapshot-utils`
2. `@lwc/jest-jsdom-test-env`
3. `@lwc/jest-preset`

### Jest Configuration

Jest is the primary tool used for testing, and both "core" and "off-core" repositories rely on it for server-side and client-side tests. The test configuration differs for each environment.

#### Server-Side Rendering Configuration

In server-side testing, we focus on generating static HTML on the server. Below is a sample configuration file for server-side testing:

[Server-Side Jest Configuration](https://github.com/salesforce/lwc-test/blob/master/example-ssr/jest.ssr-server.config.js)

#### Client-Side Rendering Configuration

For client-side testing, we validate how the component behaves after the client-side hydration. Below is a sample configuration for client-side-rendering testing:

[Client-Side Jest Configuration](https://github.com/salesforce/lwc-test/blob/master/example-ssr/jest.ssr-client.config.js)

At present, hydration errors are tracked by monitoring the console.warn event.

[Client-Side Setup Configuration](https://github.com/salesforce/lwc-test/blob/master/example-ssr/jest.ssr-client.setupAfterEnv.js)

### Running Tests

You can run server-side and client-side tests independently using the following scripts from `package.json`:

-   Server-side: [Server-Side Script](https://github.com/salesforce/lwc-test/blob/e43ba7be692b42ce91c992828547a3749df1a932/package.json#L8)
-   Client-side: [Client-Side Script](https://github.com/salesforce/lwc-test/blob/e43ba7be692b42ce91c992828547a3749df1a932/package.json#L9)

In a core environment using Bazel, the corresponding commands are:

-   Server-side: `bazel test //ui-flexipage-components:jest_test --test_arg="--projects=jest.ssr-server.config.js"`
-   Client-side: `bazel test //ui-flexipage-components:jest_test --test_arg="--projects=jest.ssr-client.config.js"`

Alternatively, use `jest --selectProjects <project_name>` to target specific test suites.

### Writing Tests

#### Server-Side Snapshot Generation

Server-side tests generate static HTML markup as snapshots. These snapshots are critical in verifying the consistency of server-rendered output.

1. Run server-side tests to generate initial snapshots.
2. When component changes occur, rerun server-side tests to identify markup changes. If discrepancies arise, the tests will fail.
3. Update the snapshots once changes are confirmed valid.

#### Hydration Using SSR-Generated Markup from Snapshots

Client-side tests utilize server-side snapshots to validate the post-hydration behavior of components:

1. Read server-side-generated snapshots.
2. Insert the pre-rendered markup into the DOM.
3. Hydrate the component and validate its behavior in the client environment.

**Note:** SSR client-rendering testing, by comparing pre- and post-hydration markup, helps identify potential performance issues early. It can reveal inconsistencies, layout shifts, and inefficiencies, enabling teams to address them before they affect the overall user experience.

#### Snapshot Management

-   **Snapshot hash**: Every part of the snapshot associated with a table-driven test case is linked to a unique hash, generated from the component's tag name, properties, and state. This approach ensures the integrity between server-side and client-side tests by enabling precise comparisons during hydration, ensuring that each test case aligns with its expected rendered output.
-   **Updating snapshots**: After modifying a component, update the corresponding snapshot to ensure alignment with changes.

#### Sample Tests

-   **Non data-driven tests**: [Non Data-Driven Sample Tests](https://github.com/salesforce/lwc-test/pull/314/files#diff-b4be588045a9278665bdee8782f5a14112afeee9d955a85278587a3ca3d4cefe)
-   **Data-driven tests**: [Data-Driven Sample Tests](https://github.com/salesforce/lwc-test/pull/314/files#diff-b2fd25d336c20558d4661b6c707e870b657dfd979fc9348acd954b6e2656a907)

## Component Testing

### Overview

Component testing focuses on testing the component in isolation, allowing for precise verification of its appearance and behavior. This approach is better than end-to-end tests because it eliminates dependencies on other parts of the application, leading to faster, more reliable, and easier-to-debug tests.

### Architecture

#### Test Environment

For the test runtime environment, we strongly recommend using LWR (Lightning Web Runtime). LWR is specifically designed for Lightning Web Components and provides support for server-side rendering.

#### Test Framework

We suggest using WebdriverIO as the test framework. WebdriverIO aligns with the W3C WebDriver protocol—a recommended standard for browser automation—ensuring that our visual tests comply with industry best practices. By leveraging WebdriverIO, developers can create and use UTAM Page Objects, which offer benefits such as encapsulating UI elements and interactions into reusable components, improving test maintainability, reducing code duplication, and facilitating easier updates as UI changes occur.

#### Test Runner

For structuring and executing tests, Jasmine is recommended. Jasmine is a behavior-driven development framework that integrates seamlessly with WebdriverIO. It provides a clear, descriptive syntax for writing tests and assertions, enhancing readability and maintainability. Using Jasmine ensures that our tests are well-structured and aligned with best practices, contributing to effective test organization and scalability.

#### UTAM Page Objects

WebdriverIO supports UTAM (Universal Test Automation Model) Page Objects, which encapsulate UI elements and interactions into reusable components. Using UTAM improves test maintainability, reduces code duplication, and simplifies updates when UI changes occur, making the test codebase more scalable and manageable.

#### Typical Workflow for Test Setup

1. **Create and configure LWR application**:

    - Set up application template: Create an LWR application. Define the components that you want to test within this application.
    - Configure routes: Set up routes in your LWR application to point to the specific component under test.

2. **Start LWR Server Instance**:
    - Spawn LWR server: Launch a new instance of the LWR server. This server will serve the application and components you’ve configured for testing.
    - Verify server initialization: Ensure that the LWR server is running correctly and serving the application without errors.

### Configs

-   **WDIO Config**: [WDIO Config Sample](https://github.com/salesforce/lwc-test/pull/314/files#diff-f0adea90ff879e9d030af6885d8a1b2705022d949494d932323ab9be5666c56f)
-   **LWR Config**: [LWR Config Sample](https://github.com/salesforce/lwc-test/pull/314/files#diff-e6768b3c6557b29ebd8ef177d8d61a525f63a2958e04e0ff41ea5e8dea55b7d8)
-   **UTAM Config**: [UTAM Config Sample](https://github.com/salesforce/lwc-test/pull/314/files#diff-1688eed176abf6e51d504f18c3166436b7674384bb604442a1006592fac541cf)

### Testing Types

#### Interactivity Testing

This type of testing assesses a component's behavior and interactions in a real browser environment after it has been fully rendered and is interactive ("post-hydration"). By simulating real user interactions, interactivity testing provides more accurate results than unit tests, effectively capturing event handling and dynamic updates. As a result, developers gain greater confidence in the component's functionality and reliability.

**Workflow**:

1. Generate UTAM POs: Create UTAM POs for the components under test, encapsulating UI elements and interactions for modular and reusable tests.
2. Automate interactivity tests: Use WebdriverIO with UTAM POs to navigate to the relevant routes. Simulate user interactions like clicks and typing. Verify that the component behaves correctly and remains interactive post-hydration.
3. Validate results: Ensure all interactive elements respond as expected and maintain their intended functionality.

**Sample Tests**: [Interactivity Test Sample](https://github.com/salesforce/lwc-test/pull/314/files#diff-9bb40ac25da0bc7e8c64ab4b50dcf32590387f7469b5f3754f8b6847403a734e)

#### Visual Regression Testing

Visual regression testing verifies that UI components maintain their expected appearance after changes. This testing type is crucial for ensuring that updates, such as styling modifications or component refactors, do not unintentionally alter the visual presentation.

**Workflow**:

1. **Set Up Visual Regression Environment**: Use WebdriverIO in conjunction with tools like Percy or BackstopJS to capture and compare visual snapshots of components.
2. **Capture Initial Snapshots**: Execute tests to capture baseline images of the components in their expected states. Store these images for future comparisons.
3. **Run Visual Regression Tests**: Whenever changes are made to the component, run the visual regression tests again to capture new images.
4. **Compare Images**: Analyze the new images against the baseline. If discrepancies are detected, review the changes to determine if they are intentional or require further attention.

**Sample Tests**: [Visual Regression Test Sample](https://github.com/salesforce/lwc-test/pull/314/files#diff-6854b8d05f69d792c8853c19ee8e5d72109c4c39e9630e54b9afc9b373c73a03)
