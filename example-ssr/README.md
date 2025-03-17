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

-   Server-side: [Server-Side Script](https://github.com/salesforce/lwc-test/blob/master/package.json#L15)
-   Client-side: [Client-Side Script](https://github.com/salesforce/lwc-test/blob/master/package.json#L16)

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

-   **Shadow Root (Non data-driven tests**): [Non Data-Driven Sample Tests](https://github.com/salesforce/lwc-test/tree/master/example-ssr/src/modules/x/hello/__tests__)

-   **LightDom (Non Data-Driven Tests)**: [Non Data-Driven Sample Tests](https://github.com/salesforce/lwc-test/tree/master/example-ssr/src/modules/x/lightDomClickMe/__tests__)

-   **Data-driven tests**: [Data-Driven Sample Tests](https://github.com/salesforce/lwc-test/tree/master/example-ssr/src/modules/x/basic/__tests__)

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

-   **WDIO Config**: [WDIO Bse Config Sample](https://github.com/salesforce/lwc-test/blob/master/wdio.base.config.js)
-   **LWR Config**: [LWR Config Sample](https://github.com/salesforce/lwc-test/blob/master/lwr.config.json)
-   **UTAM Config**: [UTAM Config Sample](https://github.com/salesforce/lwc-test/blob/master/utam.config.json)

### Testing Types

#### Interactivity Testing

This type of testing assesses a component's behavior and interactions in a real browser environment after it has been fully rendered and is interactive ("post-hydration"). By simulating real user interactions, interactivity testing provides more accurate results than unit tests, effectively capturing event handling and dynamic updates. As a result, developers gain greater confidence in the component's functionality and reliability.

**Workflow**:

1. Generate UTAM POs: Create UTAM POs for the components under test, encapsulating UI elements and interactions for modular and reusable tests.
2. Automate interactivity tests: Use WebdriverIO with UTAM POs to navigate to the relevant routes. Simulate user interactions like clicks and typing. Verify that the component behaves correctly and remains interactive post-hydration.
3. Validate results: Ensure all interactive elements respond as expected and maintain their intended functionality.

**Sample Tests**: [Interactivity Test Sample](https://github.com/salesforce/lwc-test/blob/master/example-ssr/src/modules/x/hello/__component__/hello.ssr-interactivity.test.js)

#### Visual Regression Testing

Visual regression testing verifies that UI components maintain their expected appearance after changes. This testing type is crucial for ensuring that updates, such as styling modifications or component refactors, do not unintentionally alter the visual presentation.

**Workflow**:

1. **Set Up Visual Regression Environment**: Use WebdriverIO in conjunction with tools like Percy or BackstopJS to capture and compare visual snapshots of components.
2. **Capture Initial Snapshots**: Execute tests to capture baseline images of the components in their expected states. Store these images for future comparisons.
3. **Run Visual Regression Tests**: Whenever changes are made to the component, run the visual regression tests again to capture new images.
4. **Compare Images**: Analyze the new images against the baseline. If discrepancies are detected, review the changes to determine if they are intentional or require further attention.

**Sample Tests**: [Visual Regression Test Sample](https://github.com/salesforce/lwc-test/blob/master/example-ssr/src/modules/x/hello/__component__/hello.ssr-visual.test.js)

# End-to-End Tests

## Overview

End-to-end testing validates the entire application flow, from the user interface to the backend systems, ensuring that all components work together as expected. These tests simulate real user scenarios and interactions to verify that the application behaves correctly in a production-like environment.

## Test Framework

We recommend using the same framework for component testing: **WebdriverIO** in conjunction with **UTAM Page Objects**.

---

# Performance Testing

## Overview

Performance testing focuses on evaluating how an application behaves under various conditions, particularly regarding speed, responsiveness, and stability. It helps identify bottlenecks and ensures that the application meets performance benchmarks before going live.

## Test Framework

We recommend using the same framework for component testing: **WebdriverIO** in conjunction with **PerformanceObserver** (a Web API that allows developers to monitor and analyze performance-related events in web applications).

## Workflow

1. **Navigate to the Target URL**: Use `browser.url()` to load the page you want to test.
2. **Execute a Script in the Browser Context**:  
   Use `browser.execute()` to run a script that sets up the PerformanceObserver. This script will capture performance metrics based on specified entry types (e.g., marks, measures, resources).
3. **Set Up the PerformanceObserver**:  
   Inside the execute callback, create a new instance of `PerformanceObserver`. Use the `observe` method to specify which types of performance entries to monitor.
4. **Capture Metrics**:  
   Store the observed metrics in an array or object for later use.
5. **Return Metrics**:  
   Return the collected metrics from the execute callback for assertions.
6. **Assertions**:  
   Perform any necessary assertions on the collected metrics to evaluate performance.

## Metrics

-   **Largest Contentful Paint (LCP)**:  
    Measures the time it takes for the largest visible content element (such as an image or block of text) to load and become visible to the user.  
    **Goal**: An optimal LCP of under 2.5 seconds for a good user experience.

-   **Cumulative Layout Shift (CLS)**:  
    Quantifies the amount of unexpected layout shifts that occur during the page load.  
    **Goal**: A CLS score of less than 0.1 to ensure a stable and visually coherent experience as content loads.

## Sample Tests

We strongly recommend running performance tests at the page level. The sample tests are shown at the component level for demonstration purposes only.

For sample tests, please refer to: [Performance Sample Test](https://github.com/salesforce/lwc-test/blob/master/example-ssr/src/modules/x/hello/__performance__/hello.ssr-performance.test.js)

### SSR Compiler Version Support

We now support testing against SSR Compiler v1 and v2 both. By default, tests run against SSR v2. However, if you want to test with v1, set the environment variable `LWC_SSR_MODE` to v1.
