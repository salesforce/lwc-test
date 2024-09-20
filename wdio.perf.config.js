const wdioConfig = require('./wdio.config.js'); // Your base config

exports.config = {
    ...wdioConfig.config,
    specs: ['**/__perf__/*.test.js'],
    // Add other performance-specific overrides if necessary
};
