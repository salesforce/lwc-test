// LWC VFragments use either empty text nodes or comment nodes as start/end markers:
// https://github.com/salesforce/lwc/blob/5bf31ea6d433d74500d6b8be9a8486bb92f2d542/packages/%40lwc/engine-core/src/framework/api.ts#L108-L109
// Removing these from the serialized snapshot reduces whitespace noise in snapshots.
function cleanEmptyTextAndComments(node) {
    for (const child of [...node.childNodes]) {
        if (
            [Node.TEXT_NODE, Node.COMMENT_NODE].includes(child.nodeType) &&
            child.textContent === ''
        ) {
            child.remove();
        }
    }
}

module.exports = cleanEmptyTextAndComments;
