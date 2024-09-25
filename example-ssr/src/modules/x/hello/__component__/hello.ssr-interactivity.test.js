const Hello = require('../../../../../pageObjects/hello.mjs').default;
const { browser } = require('@wdio/globals');

describe('Interactivity tests', () => {
    let helloPage;

    beforeEach(async () => {
        await browser.url('/x-hello-hydrated');
        // eslint-disable-next-line no-undef
        helloPage = await utam.load(Hello);
    });

    it('should display a greeting message after submitting a name', async () => {
        expect(helloPage).not.toBeNull();

        // Find the input field and button using the Page Object methods
        const nameInput = await helloPage.getName();
        const submitButton = await helloPage.getButton();
        // Enter a name into the input field
        await nameInput.setText('John Doe');

        // Click the submit button
        await submitButton.click();

        // Wait for the greeting message to appear in the <p> tag
        const greetingMessage = await helloPage.getPContent();

        // Validate the greeting message content
        const greetingText = await greetingMessage.getText();
        expect(greetingText).toBe('Hello, John Doe');
    });
});
