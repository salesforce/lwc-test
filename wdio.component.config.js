const path = require('node:path');
const wdioConfig = require('./wdio.config.js');
const baselineFolder = path.join(process.cwd(), 'before-hydration-image');
const screenshotPath = path.join(process.cwd(), 'after-hydration-image');
const diffFolder = path.join(process.cwd(), 'diff');

exports.config = {
    ...wdioConfig.config,
    specs: ['**/__component__/*.test.js'],
    services: [
        ...(wdioConfig.services || []),

        [
            'visual',
            {
                baselineFolder,
                formatImageName: '{tag}',
                diffFolder,
                screenshotPath,
                savePerInstance: true,
            },
        ],
    ],
};
