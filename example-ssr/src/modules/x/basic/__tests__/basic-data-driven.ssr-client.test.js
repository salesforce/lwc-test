import { readSnapshotMarkup } from '@lwc/jest-ssr-snapshot-utils';
import { hydrateShadowRoots } from '@webcomponents/template-shadowroot';
import { hydrateComponent } from '@lwc/engine-dom';
import Basic from '../basic';
import tests from './test-data';

describe('<x-basic>', () => {
    let wrapper;

    // Set up a wrapper element for each test
    beforeEach(() => {
        wrapper = document.createElement('div');
        document.body.appendChild(wrapper);
    });

    // Clean up the wrapper element after each test
    afterEach(() => {
        if (wrapper) document.body.removeChild(wrapper);
    });

    // Run tests for each set of props defined in 'tests'
    it.each(tests)('should render on the client (props = $props)', async ({ props }) => {
        // Retrieve the snapshot markup for the component with given props
        const markup = readSnapshotMarkup('x-basic', props);
        expect(markup).not.toBeNull();

        // Set the inner HTML of the wrapper to the snapshot markup
        wrapper.innerHTML = markup;

        // Extract the content inside the template element (pre-hydration)
        const preHydratedMarkup = wrapper.querySelector(
            'template[shadowrootmode="open"]'
        ).innerHTML;

        // Hydrate the shadow roots for the wrapper
        hydrateShadowRoots(wrapper);

        const componentEl = wrapper.firstElementChild;

        // Check that the component is an instance of HTMLElement and has a shadow root
        expect(componentEl?.shadowRoot).not.toBeNull();

        // Hydrate the component with the provided props
        hydrateComponent(componentEl, Basic, props);

        // Validate that the shadow DOM content matches the pre-hydration markup
        // It is also a simple Cumulative Layout Shift (CLS) test
        expect(componentEl.shadowRoot.innerHTML).toBe(preHydratedMarkup);

        // Query for the h1 element inside the shadow root
        const h1El = componentEl.shadowRoot.querySelector('h1');

        // Validate that the h1 element is present and displays the correct message
        expect(h1El?.textContent).toContain(props.msg);
    });
});
