const Greeting = require('../hello').default;
const { renderAndHashComponent } = require('@lwc/jest-ssr-snapshot-utils');

describe('<x-hello>', () => {
    test('should render on the server', async () => {
        const { renderedComponent, snapshotHash } = renderAndHashComponent('x-hello', Greeting);
        expect(renderedComponent).toMatchSnapshot(snapshotHash);
    });
});
