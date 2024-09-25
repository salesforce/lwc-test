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

exports.config = {
    framework: 'jasmine',
    jasmineOpts: {
        defaultTimeoutInterval: 10000, // 10 seconds
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
    bidi: false,
    waitforTimeout: 10000,
    services: [
        [
            UtamWdioService,
            {
                /* UTAM specific properties */
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
