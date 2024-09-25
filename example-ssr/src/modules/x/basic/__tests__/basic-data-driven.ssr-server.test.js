const Basic = require('../basic').default;
const { renderAndHashComponent } = require('@lwc/jest-ssr-snapshot-utils');
const tests = require('./test-data').default;

describe('<x-basic>', () => {
    it.each(tests)('should render on the server (props = $props)', async ({ props }) => {
        const { renderedComponent, snapshotHash } = renderAndHashComponent('x-basic', Basic, props);
        expect(renderedComponent).toMatchSnapshot(snapshotHash);
    });
});
