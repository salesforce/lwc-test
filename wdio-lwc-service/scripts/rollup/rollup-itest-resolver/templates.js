/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
exports.app = ({ namespace, component }) => {
    return `
        import { createElement } from 'lwc';
        import Component from './${namespace}/${component}/${component}';
        const element = createElement('${namespace}-${component.toLowerCase()}', { is: Component });
        document.body.appendChild(element);
    `;
}


const COMPAT = `
    <script src="../../engine/downgrade.js"></script>
    <script src="../../engine/polyfills.js"></script>
`;


exports.html = (component, { isCompat }) => (`
<!DOCTYPE html>
<html>
    <head>
        <title>${component}</title>
        <link rel="stylesheet" href="../../assets/styles/salesforce-lightning-design-system.min.css" type="text/css"/>
    </head>
    <body>
        <script>
            typeof process === 'undefined' && (process = { env: { NODE_ENV: 'development' } });
        </script>
        ${isCompat ? COMPAT : ''}
        <script src="../../engine/engine.js"></script>
        <script src="../../engine/wire.js"></script>
        <script src="./bundle.js"></script>
    </body>
</html>
`);
