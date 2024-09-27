const path = require('node:path');
const wdioConfig = require('./wdio.base.config.js');
const baselineFolder = path.join(process.cwd(), 'example-ssr', 'before-hydration-image');
const screenshotPath = path.join(process.cwd(), 'example-ssr', 'after-hydration-image');
const diffFolder = path.join(process.cwd(), 'diff');

exports.config = {
    ...wdioConfig.config,
    specs: ['**/__component__/*-visual.test.js'],
    services: [
        ...(wdioConfig.config.services || []),
        [
            'visual',
            {
                baselineFolder,
                formatImageName: '{tag}-{logName}-{width}x{height}',
                diffFolder,
                screenshotPath,
                savePerInstance: true,
            },
        ],
    ],
};
