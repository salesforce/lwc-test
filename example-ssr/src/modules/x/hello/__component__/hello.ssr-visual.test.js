import { browser } from '@wdio/globals';

describe('Check screenshots before and after hydration for layout shifts', () => {
    it('mismatch percentage should be below the acceptable threshold 1', async () => {
        // Navigate to the SSR-able only component page
        await browser.url('/x-hello-ssr-only');

        // Capture the baseline screenshot for the SSR-able only component
        await browser.saveScreen('x-hello');

        // Use waitUntil to ensure the screenshot process has completed successfully
        await browser.waitUntil(
            async () => {
                const result = await browser.checkScreen('x-hello');
                // Check that the baseline image is captured with no differences
                return result === 0;
            },
            {
                // Set timeout to 20 seconds for the screenshot comparison
                timeout: 20000,
                // Error message if the comparison does not complete in time
                timeoutMsg: 'Screenshot comparison for x-hello did not complete in time',
            }
        );

        // Navigate to the hydrated component page
        await browser.url('/x-hello-hydrated');

        // Compare the baseline screenshot of the SSR-able only component with the hydrated component
        const result = await browser.checkScreen('x-hello');

        // Assert that the mismatch percentage is below the acceptable threshold 1
        expect(result).toBeLessThan(1);
    });
});
