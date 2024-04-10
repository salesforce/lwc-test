const knownScopedCssFiles = new Set();

/**
 * Indicate that this file is a scoped CSS file.
 * @param filename - full absolute file path
 */
function addKnownScopedCssFile(filename) {
    knownScopedCssFiles.add(filename);
}

/**
 * Check if this file is a scoped CSS file.
 * @param filename - full absolute file path
 * @returns {boolean} - true if scoped
 */
function isKnownScopedCssFile(filename) {
    return knownScopedCssFiles.has(filename);
}

const knownScopeTokens = new Set();

/**
 * Indicate that this string is a scope token (used by LWC for style scoping).
 * @param str - scope token string
 */
function addKnownScopeToken(str) {
    // attributes in the HTML namespace are case-insensitive, so we treat everything as lowercase
    knownScopeTokens.add(str.toLowerCase());
}

/**
 * Check if this string is a known scope token
 * @param str - string to check
 * @returns {boolean} - true if it's a known scope token
 */
function isKnownScopeToken(str) {
    // attributes in the HTML namespace are case-insensitive, so we treat everything as lowercase
    return typeof str === 'string' && knownScopeTokens.has(str.toLowerCase());
}

/**
 * Check if there are any scope tokens we know about
 * @returns {boolean} - true if we have any scope tokens
 */
function hasKnownScopeTokens() {
    return knownScopeTokens.size > 0;
}

/**
 * Get a regex matching all known scope tokens
 @returns {RegExp} - regex representing the list of known scope tokens
 */
function getKnownScopeTokensRegex() {
    // sort from longest to shortest so that `{foo-host}` is fully replaced, not just `{foo}-host`
    const regexString = [...knownScopeTokens].sort((a, b) => b.length - a.length).join('|');
    // attributes in the HTML namespace are case-insensitive, so the regex must be case-insensitive
    return new RegExp(regexString, 'gi');
}

module.exports = {
    addKnownScopedCssFile,
    isKnownScopedCssFile,
    addKnownScopeToken,
    isKnownScopeToken,
    getKnownScopeTokensRegex,
    hasKnownScopeTokens,
};
