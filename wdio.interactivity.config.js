const wdioConfig = require('./wdio.base.config.js');

exports.config = {
    ...wdioConfig.config,
    specs: ['**/__component__/*-interactivity.test.js'],
};
