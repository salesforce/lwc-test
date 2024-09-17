module.exports = {
    displayName: 'Server-side rendering',
    preset: '@lwc/jest-preset/ssr-server',
    testMatch: ['**/*.ssr-server.(spec|test).(js|ts)'],
    collectCoverage: true,
    collectCoverageFrom: ['**/*.ssr-server.(spec|test).(js|ts)'],
};
