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
    knownScopeTokens.add(str);
}

/**
 * Check if this string is a known scope token
 * @param str - string to check
 * @returns {boolean} - true if it's a known scope token
 */
function isKnownScopeToken(str) {
    return knownScopeTokens.has(str);
}

module.exports = {
    addKnownScopedCssFile,
    isKnownScopedCssFile,
    addKnownScopeToken,
    isKnownScopeToken
};
