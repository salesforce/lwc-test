// Based on Jest's toThrow() https://jestjs.io/docs/expect#tothrowerror
// regular expression: error message matches the pattern
// string: error message includes the substring
// error object: error message is equal to the message property of the object
// error class: error object is instance of class
function matches(matcher, error) {
    if (!matcher) {
        return true; // any error will do
    }
    if (typeof matcher === 'string') {
        return error.message.includes(matcher);
    }
    if (matcher instanceof RegExp) {
        return matcher.test(error.message);
    }
    if (typeof matcher === 'function') {
        // Error class
        return error instanceof matcher;
    }
    if (matcher.message) {
        // Error object
        return error.message === matcher.message;
    }
}

// Custom matcher to test for errors in a connectedCallback of a web component,
// either LWC or third-party.
// Due to native vs synthetic lifecycle (https://github.com/salesforce/lwc/pull/3662),
// the connectedCallback function may either throw a synchronous error or an async error
// on `window.onerror`. This function is agnostic to both and can be used as a drop-in replacement
// for `toThrow()`/`toThrowError`.
function createMatcher(matcherName) {
    return {
        [matcherName]: function toThrowErrorInConnectedCallback(func, matcher) {
            if (typeof func !== 'function') {
                throw new Error(`Expected a function, received: {func}`);
            }

            // There are two cases here:
            // 1) Error is thrown by LWC component with synthetic behavior (sync)
            // 2) Error is thrown by third-party component or LWC with native behavior (async)
            // We don't care which one we get; they are both treated the same.
            let syncError;
            let asyncError;

            const listener = (errorEvent) => {
                errorEvent.preventDefault(); // do not continue bubbling the error; we're handling it
                asyncError = errorEvent.error;
            };
            window.addEventListener('error', listener);
            try {
                func();
            } catch (err) {
                syncError = err;
            } finally {
                window.removeEventListener('error', listener);
            }

            const { utils } = this;
            const overallError = syncError || asyncError;
            const pass = !!overallError && matches(matcher, overallError);

            // Inspired by https://github.com/jest-community/jest-extended/blob/1f91c09/src/matchers/toThrowWithMessage.js#L25
            // This shows a nicely-formatted error message to the user
            const positiveHint = utils.matcherHint(`.${matcherName}`, 'function', 'expected');
            const negativeHint = utils.matcherHint(`.not.${matcherName}`, 'function', 'expected');
            const message =
                `${pass ? positiveHint : negativeHint}` +
                '\n\n' +
                `Expected connectedCallback${pass ? ' not' : ''} to throw:\n` +
                `  ${
                    matcher ? utils.printExpected(matcher) : utils.EXPECTED_COLOR('Any error')
                }\n` +
                'Thrown:\n' +
                `  ${
                    overallError
                        ? utils.printReceived(overallError)
                        : utils.RECEIVED_COLOR('No error')
                }\n`;

            return {
                pass,
                message: () => message,
            };
        },
    };
}
expect.extend({
    // both names are accepted, ala Jest's `toThrow` and `toThrowError` being equivalent
    ...createMatcher('toThrowInConnectedCallback'),
    ...createMatcher('toThrowErrorInConnectedCallback'),
});
