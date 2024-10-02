import { readSnapshotMarkup } from '@lwc/jest-ssr-snapshot-utils';
import { hydrateComponent } from '@lwc/engine-dom';
import LightDomClickMe from '../lightDomClickMe';

describe('<x-light-dom-click-me>', () => {
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

    test('should hydrate on the client and display the correct message', async () => {
        // Retrieve and set the snapshot markup
        const markup = readSnapshotMarkup('x-light-dom-click-me');
        expect(markup).not.toBeNull();

        // Set the innerHTML of the wrapper to the snapshot markup
        wrapper.innerHTML = markup;

        // Extract the component element
        const componentEl = wrapper.querySelector('x-light-dom-click-me');
        expect(componentEl).toBeInstanceOf(HTMLElement);

        // Extract the pre-hydration markup including the component wrapper
        const preHydratedMarkup = componentEl.outerHTML;

        const messageElement = wrapper.querySelector('.light-dom-content p');
        expect(messageElement).not.toBeNull();
        expect(messageElement.textContent).toBe('Click the button to change this message!');

        // Hydrate the component
        hydrateComponent(componentEl, LightDomClickMe);

        // Validate that the component's outerHTML matches the expected pre-hydration markup
        // Remove leading and trailing quotes
        const cleanedMarkup = markup.replace(/^"|"$/g, '');
        // It is also a simple Cumulative Layout Shift (CLS) test
        expect(preHydratedMarkup).toBe(cleanedMarkup);

        // Simulate button click
        const button = wrapper.querySelector('button');
        expect(button).not.toBeNull();
        button.click();

        // Allow for DOM updates
        await Promise.resolve();

        // Validate the message change after button click
        expect(messageElement).not.toBeNull();
        expect(messageElement.textContent).toBe('You clicked the button!');
    });
});
