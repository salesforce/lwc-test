/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const path = require('path');
const buildTest = require('./scripts/build-test');
const startStaticServer = require('./scripts/start-static-server');
const copySldsAsset = require('./scripts/copy-slds-assets');
const isCompat = require('./scripts/is-compat')();
const copyEngineFiles = require('./scripts/copy-engine-files');
const patchQuerySelector = require('./scripts/patch-query-selector');
const getInfoFromDir = require('./scripts/get-info-from-dir');
let patchOnce = true;

class LWCService {
    constructor({ services }) {
        this.options = getOptions(services);
    }

    onPrepare() {
        return startStaticServer()
            .then(copySldsAsset)
            .then(() => copyEngineFiles({ isCompat }));
    }

    beforeSuite({ file }) {
        const { name, dir } = path.parse(file);
        const { namespace, component } = getInfoFromDir(dir);
        if (patchOnce) {
            patchQuerySelector();
            patchOnce = false;
        }
        global.URL = `http://localhost:1337/${namespace}-${component}/${name}/index.html`;
        return buildTest(file, {
            isCompat,
            namespace,
            component,
            ...this.options,
        });
    }

    /*
    // Remove the need for browser.url(URL)
    beforeTest({ file }) {
        const { name } = path.parse(file);
        browser.url(`http://localhost:1337/${name}/index.html`);
    }
    */
}

function getOptions(services) {
    return services.find((serv) => {
        return Array.isArray(serv) && serv[0] === LWCService;
    })[1];
}

module.exports = LWCService;

