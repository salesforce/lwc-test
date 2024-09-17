beforeEach(() => {
    // Spy on console.warn and intercept warnings
    jest.spyOn(console, 'warn').mockImplementation((message) => {
        if (message.includes('Hydration mismatch')) {
            throw new Error(`Test failed due to hydration mismatch: ${message}`);
        } else {
            // If it's not a hydration mismatch, print the warning as usual
            console.warn(message);
        }
    });
});

afterEach(() => {
    // Restore original console.warn after each test
    jest.restoreAllMocks();
});
