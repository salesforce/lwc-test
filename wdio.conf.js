const path = require('node:path');

exports.config = {
    // ===================
    // Runner Configuration
    // ===================
    runner: 'local',

    // ==================
    // Specify Test Files
    // ==================
    specs: ['**/*.visual-ssr.spec.js'],
    exclude: [],
    framework: 'jasmine', // Specify the framework here

    // ============
    // Capabilities
    // ============
    capabilities: [
        {
            maxInstances: 1,
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: ['--headless'], // Example argument for headless mode
            },
        },
    ],

    // ===================
    // Test Configurations
    // ===================
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    services: [
        ['chromedriver'],
        [
            'visual',
            {
                // Some options, see the docs for more
                baselineFolder: path.join(process.cwd(), 'tests', 'baseline'),
                formatImageName: '{tag}-{logName}-{width}x{height}',
                screenshotPath: path.join(process.cwd(), 'tmp'),
                savePerInstance: true,
                // ... more options
            },
        ],
    ],
    reporters: ['spec'],

    // ============
    // Hooks
    // ============
    before: function () {},

    // Add additional configurations as needed
};
