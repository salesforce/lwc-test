/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import Hello from '../../../../../pageObjects/hello.mjs';

describe('Jasmine Example', () => {
    let helloPage;

    beforeAll(async () => {
        await browser.url('http://localhost:3000/x-hello');
        helloPage = await utam.load(Hello);
    });

    it('Compare hydrated image with baseline image ore hydration', async () => {
        expect(await browser.checkScreen('x-hello')).toEqual(0);
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
        expect(greetingText).toBe('Hello, John Doe'); // Adjust the expected message as per your implementation
    });
});
