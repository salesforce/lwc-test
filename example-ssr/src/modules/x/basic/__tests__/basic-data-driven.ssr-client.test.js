import { readSnapshotMarkup } from '@lwc/jest-ssr-snapshot-utils';
import { hydrateShadowRoots } from '@webcomponents/template-shadowroot';
import { hydrateComponent } from '@lwc/engine-dom';
import Basic from '../basic';
import tests from './ssr';

describe('<x-basic>', () => {
    let wrapper;
    beforeEach(() => {
        // Create and append the wrapper element before each test
        wrapper = document.createElement('div');
        document.body.appendChild(wrapper);
    });

    afterEach(() => {
        // Remove the wrapper element after each test
        if (wrapper) {
            document.body.removeChild(wrapper);
        }
    });

    it.each(tests)('should render on the client (props = $props)', async ({ props }) => {
        // Retrieve and set the snapshot markup
        const markup = readSnapshotMarkup('x-basic', props);
        expect(markup).not.toBeNull();
        wrapper.innerHTML = markup;

        // Hydrate shadow roots and component
        hydrateShadowRoots(wrapper);

        const componentEl = wrapper.firstElementChild;
        expect(componentEl).toBeInstanceOf(HTMLElement);
        expect(componentEl).toHaveProperty('shadowRoot');

        hydrateComponent(componentEl, Basic, props);

        // Query the h1 element inside the shadow root
        const shadowRoot = componentEl.shadowRoot;
        expect(shadowRoot).not.toBeNull();

        const h1El = shadowRoot.querySelector('h1');
        expect(h1El).not.toBeNull();

        // Validate that the message is correctly displayed
        expect(h1El.textContent).toContain(props.msg);
    });
});
