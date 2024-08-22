const { renderComponent: lwcRenderComponent } = require('@lwc/engine-server');
const { jestCustomSnapshotSerializer } = require('@lwc/jest-preset/src/ssr/snapshot-serializer');
const { createHash } = require('crypto');
const { readdirSync, readFileSync } = require('fs');
const { join, dirname, basename, extname } = require('path');

/**
 * Renders the component's markup, captures it in a snapshot that has a unique snapshot hash.
 *
 * @param {string} tagName - The name of the HTML tag or component.
 * @param {Function} Ctor - The constructor of the Lightning Web Component.
 * @param {Object} [props={}] - An object representing the properties of the component.
 * @param {Object} [customTestEnv={}] - An object representing the custom test env where the component is being validated.
 * @returns {{markup: string, snapshotHash: string}} - An object containing the rendered markup and the generated snapshot hash.
 */
function generateAndSnapshotMarkup(
    tagName,
    Ctor,
    props = {},
    customTestEnv = {}
) {
    expect.addSnapshotSerializer(jestCustomSnapshotSerializer);

    const renderedComponent = lwcRenderComponent(tagName, Ctor, props);
    jestCustomSnapshotSerializer.setDynamicValue('renderedComponent', renderedComponent);

    const snapshotHash = generateSnapshotHash(tagName, props, customTestEnv);

    return { renderedComponent, snapshotHash };
}

/**
 * Reads the content of a snapshot file and returns the value associated with a specific hash.
 * Throws an error if the snapshot with the specified hash is not found.
 *
 * @param {string} tagName - The name of the HTML tag or component.
 * @param {Object} [props={}] - An object representing the properties of the component.
 * @param {Object} [customTestEnv={}] - An object representing the custom test env where the component is being validated.
 * @returns {string} - The markup associated with the given hash from the snapshot.
 * @throws {Error} - If the snapshot with the specified hash is not found.
 */
function readSnapshotMarkup(
    tagName,
    props = {},
    customTestEnv = {}
) {
    const testAbsPath = global.testFilePath;
    if (!testAbsPath) {
        throw new Error('Test file path must be available in the global context. Make sure you utilize the custom JSDOM environment for SSR tests.');
    }

    const snapshotPath = findFileByPrefix(testAbsPath);
    const fileContent = readFileSync(snapshotPath, 'utf8');
    const snapshotHash = generateSnapshotHash(tagName, props, customTestEnv);

    const regexPattern = `exports\\[\\\`[^\\\`]*${snapshotHash}[^\\\`]*\\\`] = \\\`([^\\\`]*)\\\`;`;
    const match = new RegExp(regexPattern).exec(fileContent);

    if (!match) {
        throw new Error(`Snapshot with hash ${snapshotHash} not found. Ensure the SSR tests have been run to generate the snapshot.`);
    }

    return match[1];
}

/**
 * Generates a SHA-256 hash based on the provided tagName, props, and custom test env.
 *
 * @param {string} tagName - The name of the HTML tag or component.
 * @param {Object} [props={}] - An object representing the properties of the component.
 * @param {Object} [customTestEnv={}] - An object representing the custom test env where the component is being validated.
 * @returns {string} - A hexadecimal string representing the generated hash.
 */
function generateSnapshotHash(
    tagName,
    props = {},
    customTestEnv = {}
) {
    return createHash('sha256')
        .update(tagName)
        .update(JSON.stringify(props))
        .update(JSON.stringify(customTestEnv))
        .digest('hex');
}

/**
 * Finds a snapshot file in the '__snapshots__' directory within the test suite directory
 * that starts with the test file name before the first period (including the period), for instance:
 * test file name: actionButton.server.test.ts, prefix: actionButton.
 *
 * @param {string} testSuiteAbsPath - The absolute path of the test suite file.
 * @returns {string} - The absolute path to the found snapshot file.
 * @throws {Error} - If no matching file is found or if an error occurs reading the directory.
 */
function findFileByPrefix(testSuiteAbsPath) {
    const testFileDir = dirname(testSuiteAbsPath);
    const snapshotsDir = join(testFileDir, '__snapshots__');

    // Extract the first portion of the filename including the period
    const baseName = basename(testSuiteAbsPath, extname(testSuiteAbsPath));
    const periodIndex = baseName.indexOf('.');
    const fileNamePrefix = periodIndex === -1 ? baseName : baseName.substring(0, periodIndex + 1);

    try {
        const matchedFile = readdirSync(snapshotsDir).find(file => file.startsWith(fileNamePrefix));

        if (!matchedFile) {
            throw new Error(`File starting with prefix '${fileNamePrefix}' not found in directory '${snapshotsDir}'.`);
        }

        return join(snapshotsDir, matchedFile);
    } catch (error) {
        console.error(`Error reading directory: ${error.message}`);
        throw error;
    }
}

module.exports = { generateAndSnapshotMarkup,
    readSnapshotMarkup};
