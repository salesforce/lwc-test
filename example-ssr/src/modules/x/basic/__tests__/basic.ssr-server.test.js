import Basic from '../basic';
import { renderAndHashComponent } from '@lwc/jest-ssr-snapshot-utils';

describe('<x-basic>', () => {
    test('should render on the server', async () => {
        const { renderedComponent, snapshotHash } = renderAndHashComponent('x-basic', Basic, {
            msg: 'Welcome!',
        });
        expect(renderedComponent).toMatchSnapshot(snapshotHash);
    });
});
