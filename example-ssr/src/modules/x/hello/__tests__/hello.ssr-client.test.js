import { readSnapshotMarkup } from '@lwc/jest-ssr-snapshot-utils';
import { hydrateShadowRoots } from '@webcomponents/template-shadowroot';
import { hydrateComponent } from '@lwc/engine-dom';
import Greeting from '../hello';

describe('<x-greeting>', () => {
    let wrapper;

    beforeEach(() => {
        // Create and append the wrapper element
        wrapper = document.createElement('div');
        document.body.appendChild(wrapper);
    });

    afterEach(() => {
        // Remove the wrapper element
        if (wrapper) {
            document.body.removeChild(wrapper);
        }
    });

    test('should hydrate on the client and display greeting message', async () => {
        // Retrieve and set the snapshot markup
        const markup = readSnapshotMarkup('x-hello'); // Ensure this matches the correct snapshot
        expect(markup).not.toBeNull();
        wrapper.innerHTML = markup;

        // Extract the pre-hydration markup for validation
        const preHydratedMarkup = wrapper.querySelector(
            'template[shadowrootmode="open"]'
        ).innerHTML;

        // Hydrate shadow roots and component
        hydrateShadowRoots(wrapper);

        const componentEl = wrapper.firstElementChild;
        // Check that the first element is an HTMLElement and has a shadowRoot
        expect(componentEl).toBeInstanceOf(HTMLElement);
        expect(componentEl).toHaveProperty('shadowRoot');

        // Hydrate the component
        hydrateComponent(componentEl, Greeting);

        const shadowRoot = componentEl.shadowRoot;
        // Check that the shadowRoot is not null
        expect(shadowRoot).not.toBeNull();
        // Validate that the shadow DOM content matches the pre-hydration markup
        // It is also a simple Cumulative Layout Shift (CLS) test
        expect(shadowRoot.innerHTML).toBe(preHydratedMarkup);

        // Simulate user input and submit
        const nameInput = shadowRoot.querySelector('input#name');
        const submitButton = shadowRoot.querySelector('button');

        // Check initial state (no greeting message)
        expect(shadowRoot.querySelector('p')).toBeNull();

        // Simulate entering a name and submitting
        nameInput.value = 'John Doe';
        nameInput.dispatchEvent(new CustomEvent('change', { bubbles: true }));
        submitButton.click();

        // Wait for any promises to resolve
        await Promise.resolve();

        // Validate the greeting message appears
        const greetingMessage = shadowRoot.querySelector('p');
        expect(greetingMessage).not.toBeNull();
        expect(greetingMessage.textContent).toBe('Hello, John Doe');
    });
});
