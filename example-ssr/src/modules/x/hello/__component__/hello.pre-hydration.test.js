/* eslint-disable no-undef */

describe('Capture Baseline Images Before Hydration', () => {
    beforeAll(async () => {
        await browser.url('http://localhost:3000/x-hello');
    });
    it('should capture baseline image of the component before hydration', async () => {
        const componentUrl = '/x-hello'; // Replace with the actual route to your component
        await browser.url(componentUrl);
        // Capture the baseline image (before hydration)
        await browser.saveScreen('x-hello');
        console.log('Captured baseline image before hydration.');
    });
});
