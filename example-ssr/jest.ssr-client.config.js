module.exports = {
    displayName: 'SSR with hydration',
    preset: '@lwc/jest-preset/ssr-for-hydration',
    setupFilesAfterEnv: ['./jest.ssr-client.setupAfterEnv.js'],
    collectCoverage: true,
    collectCoverageFrom: ['**/*.ssr-client.(spec|test).(js|ts)'],
    testMatch: ['**/*.ssr-client.(spec|test).(js|ts)'],
    transformIgnorePatterns: ['node_modules/(?!(@lwc/test-utils|@webruntime|@webcomponents/.+)/)'],
};
