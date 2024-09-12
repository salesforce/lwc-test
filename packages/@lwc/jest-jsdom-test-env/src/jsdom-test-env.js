const JSDOMEnvironment = require('jest-environment-jsdom').TestEnvironment;

/**
 * Custom Jest environment extending JSDOM.
 */
class CustomJSDOMEnvironment extends JSDOMEnvironment {
    /**
     * Initializes the custom environment.
     *
     * @param {object} config - Jest configuration.
     * @param {object} context - Test context, including file path.
     */
    constructor(config, context) {
        super(config, context);
        this.testPath = context.testPath;
    }

    /**
     * Sets up the environment, including the test file path.
     */
    async setup() {
        await super.setup();
        this.global.testFilePath = this.testPath;
    }

    /**
     * Cleans up the environment.
     */
    async teardown() {
        await super.teardown();
    }
}

module.exports = CustomJSDOMEnvironment;
