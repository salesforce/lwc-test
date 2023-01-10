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

module.exports = {
    addKnownScopedCssFile,
    isKnownScopedCssFile
};
