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
    return knownScopeTokens.has(str.toLowerCase());
}

/**
 * Get all known scope tokens
 @returns {tokens} - list of known scope tokens
 */
function getKnownScopeTokens() {
    // attributes in the HTML namespace are case-insensitive, so we treat everything as lowercase
    return [...knownScopeTokens];
}

module.exports = {
    addKnownScopedCssFile,
    isKnownScopedCssFile,
    addKnownScopeToken,
    isKnownScopeToken,
    getKnownScopeTokens,
};
