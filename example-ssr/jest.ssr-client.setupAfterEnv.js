beforeEach(() => {
    // Spy on console.warn and intercept warnings
    jest.spyOn(console, 'warn').mockImplementation((message) => {
        if (message.includes('Hydration mismatch')) {
            // Schedule the error to be thrown in the next tick
            process.nextTick(() => {
                throw new Error(`Test failed due to hydration mismatch: ${message}`);
            });
        } else {
            // If it's not a hydration mismatch, call the original console.warn
            console.warn(message);
        }
    });
});

afterEach(() => {
    // Restore original console.warn after each test
    jest.restoreAllMocks();
});
