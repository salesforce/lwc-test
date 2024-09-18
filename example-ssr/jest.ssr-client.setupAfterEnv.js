let hydrationMismatchOccurred = false;
let hydrationMismatchMessage = '';

beforeEach(() => {
    // Reset the flag and message before each test
    hydrationMismatchOccurred = false;
    hydrationMismatchMessage = '';

    // Spy on console.warn and intercept warnings
    jest.spyOn(console, 'warn').mockImplementation((message) => {
        if (message.includes('Hydration mismatch')) {
            // Set the flag to indicate a hydration mismatch occurred
            hydrationMismatchOccurred = true;
            // Store the hydration mismatch message
            hydrationMismatchMessage = message;
        } else {
            // If it's not a hydration mismatch, call the original console.warn
            console.warn(message);
        }
    });
});

afterEach(() => {
    // Restore original console.warn after each test
    jest.restoreAllMocks();

    // Check if a hydration mismatch occurred and fail the test if so
    if (hydrationMismatchOccurred) {
        throw new Error(`Test failed due to hydration mismatch: ${hydrationMismatchMessage}`);
    }
});
