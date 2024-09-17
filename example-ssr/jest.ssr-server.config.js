module.exports = {
    displayName: 'Server-side rendering',
    preset: '@lwc/jest-preset/ssr-server',
    testMatch: ['**/*.ssr-server.(spec|test).(js|ts)'],
    collectCoverageFrom: ['**/*.ssr-server.(spec|test).(js|ts)'],
};
