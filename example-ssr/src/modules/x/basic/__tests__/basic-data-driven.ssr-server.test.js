import Basic from '../basic';
import { renderAndHashComponent } from '@lwc/jest-ssr-snapshot-utils';
import tests from './test-data';

describe('<x-basic>', () => {
    it.each(tests)('should render on the server (props = $props)', async ({ props }) => {
        const { renderedComponent, snapshotHash } = await renderAndHashComponent(
            'x-basic',
            Basic,
            props
        );
        expect(renderedComponent).toMatchSnapshot(snapshotHash);
    });
});
