const path = require('node:path');
const { UtamWdioService } = require('wdio-utam-service');
const { createServer } = require('lwr');

let server;

const onPrepare = async () => {
    try {
        server = createServer({ serverMode: 'prod-compat' });
        const { port, serverMode } = await server.listen();
        console.log(`[LWR Service] App listening on port ${port} in ${serverMode} mode\n`);
    } catch (error) {
        console.error('Error starting LWR Service:', error);
    }
};

// Shut the server down once tests are complete
const onComplete = async () => {
    if (server) {
        try {
            await server.close();
            console.log('LWR Service stopped.');
        } catch (error) {
            console.error('Error stopping LWR Service:', error);
        }
    }
};

// Reusable path constants
const baselineFolder = path.join(process.cwd(), 'tests', 'baseline');
const screenshotPath = path.join(process.cwd(), 'tmp');

exports.config = {
    specs: ['**/__component__/**/*.test.js'],
    framework: 'jasmine',
    jasmineOpts: {
        // max execution time for a script, set to 5 min
        defaultTimeoutInterval: 100000 * 60 * 5,
    },
    capabilities: [
        {
            browserName: 'chrome',
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
                baselineFolder,
                formatImageName: '{tag}-{logName}-{width}x{height}',
                screenshotPath,
                savePerInstance: true,
            },
        ],
        ['utam'],
    ],
    reporters: ['spec'],
    runner: 'local',
    baseUrl: 'http://localhost:3000',
    onPrepare,
    onComplete,
};
