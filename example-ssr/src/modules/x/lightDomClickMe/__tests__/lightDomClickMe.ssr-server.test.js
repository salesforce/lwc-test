const LightDomClickMe = require('../lightDomClickMe').default;
const { renderAndHashComponent } = require('@lwc/jest-ssr-snapshot-utils');

describe('<x-light-dom-click-me>', () => {
    test('should render on the server', async () => {
        const { renderedComponent, snapshotHash } = renderAndHashComponent(
            'x-light-dom-click-me',
            LightDomClickMe
        );
        expect(renderedComponent).toMatchSnapshot(snapshotHash);
    });
});
