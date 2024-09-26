const wdioConfig = require('./wdio.base.config.js');

exports.config = {
    ...wdioConfig.config,
    specs: ['**/__performance__/**.test.js'],
};
