module.exports = {
    displayName: 'SSR with hydration',
    preset: '@lwc/jest-preset/ssr-for-hydration',
    testMatch: ['**/*.ssr-client.(spec|test).(js|ts)'],
    setupFilesAfterEnv: ['./jest.ssr-client.setup.js'],
    collectCoverage: true,
    collectCoverageFrom: ['**/*.ssr-client.(spec|test).(js|ts)'],
    transformIgnorePatterns: ['node_modules/(?!(@lwc/test-utils|@webruntime|@webcomponents/.+)/)'],
};
