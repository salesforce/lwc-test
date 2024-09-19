const path = require('node:path');
const { UtamWdioService } = require('wdio-utam-service');
const { createServer } = require('lwr');

let server;

const onPrepare = async () => {
    server = createServer();

    await server.listen(({ port, serverMode }) => {
        console.log(`[LWR Service] App listening on port ${port} in ${serverMode} mode\n`);
    });
};

// Shut the server down once tests are complete
const onComplete = async () => {
    if (server) {
        await server.close();
        console.log('LWR Service stopped.');
    }
};
exports.config = {
    specs: ['**/__component__/**/*.test.js'],
    exclude: [],
    framework: 'jasmine', // Specify the framework here
    capabilities: [
        {
            browserName: 'chrome', // Choose your browser (chrome, firefox, etc.)
            'goog:chromeOptions': {
                args: ['--disable-gpu', '--no-sandbox'],
            },
        },
    ],
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    services: [
        [UtamWdioService, { baseUrl: 'http://localhost:3000' }],
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
    runner: 'local',

    // We add our server start and stop hooks
    onPrepare,
    onComplete,
};
