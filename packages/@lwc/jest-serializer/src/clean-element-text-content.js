// LWC VFragments use empty text nodes as start/end markers:
// https://github.com/salesforce/lwc/blob/50c1bfa/packages/%40lwc/engine-core/src/framework/api.ts#L96-L97
// Removing these from the serialized snapshot reduces whitespace noise in snapshots.
function cleanElementTextContent(node) {
    for (const child of [...node.childNodes]) {
        if (child.nodeType === Node.TEXT_NODE && child.textContent === '') {
            node.removeChild(child);
        }
    }
}

module.exports = cleanElementTextContent;
