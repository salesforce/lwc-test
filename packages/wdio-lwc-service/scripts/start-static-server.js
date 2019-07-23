/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const path = require('path');
const StaticServer = require('static-server');

module.exports = () => {
    const port = 1337;
    const server = new StaticServer({
        rootPath: path.join(__dirname, './../build'),
        port,
    });
    return new Promise((resolve) => {
        server.start(() => {
            // eslint-disable-next-line no-console
            console.log(`Server listening at http://localhost:${port}`);
            resolve();
        });
    });        
}          
