/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const PrettyFormat = require('pretty-format');
const DOMElement = PrettyFormat.plugins.DOMElement;

const cleanElementAttributes = require('./clean-element-attrs');

function test(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }

    const { nodeType } = obj;

    // According https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
    return (
        nodeType === 1 || // element
        nodeType === 3 || // text
        nodeType === 8 // comment
    );
}

const { defineProperty } = Object;

function escapeHTML(str) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function printText(text, config) {
    const contentColor = config.colors.content;
    return contentColor.open + escapeHTML(text) + contentColor.close;
}

function printChildren(children, config, indentation, depth, refs, printer) {
    return children
        .map(
            (child) =>
                config.spacingOuter +
                indentation +
                (typeof child === 'string'
                    ? printText(child, config)
                    : printer(child, config, indentation, depth, refs))
        )
        .join('');
}

function serialize(node, config, indentation, depth, refs, printer) {
    const isElement = node.nodeType === 1;
    if (isElement) {
        cleanElementAttributes(node);
    }

    const lightChildren = Array.prototype.slice.call(node.childNodes);
    defineProperty(node, 'childNodes', {
        get() {
            if (node.shadowRoot) {
                const textNode = document.createTextNode('#shadow-root(open)');
                defineProperty(textNode, 'children', {
                    value: Array.prototype.slice.call(node.shadowRoot.childNodes),
                });
                lightChildren.unshift(textNode);
            }
            return lightChildren;
        },
        configurable: true,
    });

    const result = DOMElement.serialize(
        node,
        config,
        indentation,
        depth,
        refs,
        (currentNode, currentConfig, currentIndentation, currentDepth, currentRefs) => {
            if (currentNode.textContent === '#shadow-root(open)') {
                return [
                    '#shadow-root(open)',
                    printChildren(
                        currentNode.children,
                        currentConfig,
                        currentIndentation + config.indent,
                        currentDepth + 1,
                        currentRefs,
                        printer
                    ),
                ].join('');
            }
            return printer(
                currentNode,
                currentConfig,
                currentIndentation,
                currentDepth,
                currentRefs
            );
        }
    );
    delete node.childNodes;

    return result;
}

module.exports.test = test;
module.exports.serialize = serialize;
