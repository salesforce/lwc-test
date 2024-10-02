import LightDomClickMe from '../lightDomClickMe';
import { renderAndHashComponent } from '@lwc/jest-ssr-snapshot-utils';

describe('<x-light-dom-click-me>', () => {
    test('should render on the server', async () => {
        const { renderedComponent, snapshotHash } = renderAndHashComponent(
            'x-light-dom-click-me',
            LightDomClickMe
        );
        expect(renderedComponent).toMatchSnapshot(snapshotHash);
    });
});
