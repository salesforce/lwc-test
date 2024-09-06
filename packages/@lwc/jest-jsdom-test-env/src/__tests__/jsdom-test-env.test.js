/**
 * @jest-environment @lwc/jest-jsdom-test-env
 */

const path = require('path');

describe('JSDOM custom test environment', () => {
    it('should correctly set the absolute path of the test file in global.testFilePath', () => {
        const expectedPath = path.resolve(__filename);
        expect(global.testFilePath).toBe(expectedPath);
    });
});
