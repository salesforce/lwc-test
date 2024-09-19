/* eslint-disable no-undef */
import helloPO from '../../../../../../__utam__/hello.utam.json';

describe('Jasmine Example', () => {
    let helloPage;

    beforeAll(async () => {
        // Navigate to the route where the component is hosted
        await browser.url('http://localhost:3000/hello');

        // Initialize the UTAM Page Object for the greeting component
        helloPage = await browser.getPageObject(helloPO);
    });

    it('using visual matchers to assert against baseline', async () => {
        // Check screen to exactly match with baseline
        await expect(browser).toMatchScreenSnapshot('partialPage');
        // check an element to have a mismatch percentage of 5% with the baseline
        await expect(browser).toMatchScreenSnapshot('partialPage', 5);
        // check an element with options for `saveScreen` command
        await expect(browser).toMatchScreenSnapshot('partialPage', {
            /* some options */
        });

        // Check an element to exactly match with baseline
        await expect($('#element-id')).toMatchElementSnapshot('firstButtonElement');
        // check an element to have a mismatch percentage of 5% with the baseline
        await expect($('#element-id')).toMatchElementSnapshot('firstButtonElement', 5);
        // check an element with options for `saveElement` command
        await expect($('#element-id')).toMatchElementSnapshot('firstButtonElement', {
            /* some options */
        });

        // Check a full page screenshot match with baseline
        await expect(browser).toMatchFullPageSnapshot('fullPage');
        // Check a full page screenshot to have a mismatch percentage of 5% with the baseline
        await expect(browser).toMatchFullPageSnapshot('fullPage', 5);
        // Check a full page screenshot with options for `checkFullPageScreen` command
        await expect(browser).toMatchFullPageSnapshot('fullPage', {
            /* some options */
        });

        // Check a full page screenshot with all tab executions
        await expect(browser).toMatchTabbablePageSnapshot('check-tabbable');
        // Check a full page screenshot to have a mismatch percentage of 5% with the baseline
        await expect(browser).toMatchTabbablePageSnapshot('check-tabbable', 5);
        // Check a full page screenshot with options for `checkTabbablePage` command
        await expect(browser).toMatchTabbablePageSnapshot('check-tabbable', {
            /* some options */
        });
    });

    it('should save some screenshots', async () => {
        // Save a screen
        await browser.saveScreen('helloPage', {
            /* some options */
        });
    });

    it('should compare successful with a baseline', async () => {
        // Check a screen
        await expect(
            await browser.checkScreen('helloPage', {
                /* some options */
            })
        ).toEqual(0);
    });
    it('should save some screenshots', async () => {
        // Save a screen
        await browser.saveScreen('helloPage', {
            /* some options */
        });
    });

    it('should display a greeting message after submitting a name', async () => {
        // Find the input field and button via the Page Object
        const inputField = await helloPage.getNameInput();
        const submitButton = await helloPage.getSubmitButton();

        // Enter the name 'John' in the input field
        await inputField.setValue('John');

        // Click the submit button
        await submitButton.click();

        // Verify that the greeting message is displayed correctly
        const greetingMessage = await helloPage.getGreetingMessage();
        expect(await greetingMessage.getText()).toBe('Hello, John');
    });
});
