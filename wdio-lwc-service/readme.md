# wdio-lwc-service

The `wdio-lwc-service` wires up [WebdriverIO][webdriverio] (WDIO) for testing [Lightning web components][lwcdev]. Integration tests run in the browser context unlike [unit tests][test], so keep tests focused on interactions.

> Learn more about Lightning Web Components at [lwc.dev](lwcdev).

- [Installation](#installation)
- [Configuration](#configuration)
  - [ESLint](#eslint)
- [Options](#Options)
  - [Rollup Plugins](#rollup-plugins)
- [Getting Started](#getting-started)
- [Help](#help)

## Installation 

Along with installing `wdio-lwc-service`, there are several other modules required in `package.json`.

### Install `wdio-lwc-service`

```sh
npm install wdio-lwc-service --save-dev
```

### Update `package.json`

If you used `npx lwc-create-app` to initialize your project you'll have different dependencies.

#### Using lwc-create-app

<details><summary>Click to Expand: <code>package.json</code> for use with <code>lwc-services</code></summary><p>

```json
{
    "devDependencies": {
        "lwc-services": "^2.0.1",
        "@wdio/jasmine-framework": "^5.9.4"
    }
}
```

</p></details>

#### Existing Package.json

<details><summary>Click to Expand: <code>package.json</code></summary><p>

```json
{
    "devDependencies": {
        "@lwc/compiler": "^1.0.0",
        "@lwc/engine": "^1.0.0",
        "@lwc/rollup-plugin": "^1.0.0",
        "@lwc/wire-service": "^1.0.0",
        "@wdio/cli": "^5.9.6",
        "@wdio/selenium-standalone-service": "^5.9.3",
        "@wdio/jasmine-framework": "^5.9.4",
        "@wdio/local-runner": "^5.9.6",
        "@wdio/sync": "^5.9.6",
        "compat-polyfills": "^0.21.5",
        "express": "^4.17.1",
        "rollup": "^1.14.2",
        "rollup-plugin-compat": "0.21.5",
        "rollup-plugin-cpy": "^1.1.0",
        "rollup-plugin-replace": "^2.2.0",
        "wdio-lwc-service": "^0.1.1",
        "webdriverio": "^5.9.6"
    }
}
```

</p></details>

### Install Jasmine

[Jasmine][jasmine] framework provides test methods to run your integration tests.

```sh
npm install @wdio/jasmine-framework --save-dev
```

> Examples are written for Jasmine, but you can use another test framework like [Mocha](test-framework).

## Configuration

Next, let's create a `wdio.conf.js` file in the root of your project. We recommend to **copy** the file from [`examples/basic/wdio.conf.js`][wdio-conf] in this repo.

Append `wdio-lwc-service` to the start of your services array.

```
// wdio.conf.js
const lwcService = require('wdio-lwc-service');
exports.config = {
    // ...
    specs: [
        'src/**/__wdio__/*.spec.js'
    ],
    exclude: [],
    services: [
        'selenium-standalone',
        [lwcService, {}]
    ],
    // ...
};
```

Append to the list of scripts in `package.json`. This will allow us to run `npm run test:wdio` later on.

#### For `lwc-create-app`

```
{
    "scripts: {
        ...,
        "test:wdio": "lwc-services test:wdio"
    }
}
```

#### Or without `lwc-create-app`

```
{
    "scripts: {
        ...,
        "test:wdio": "wdio"
    }
}
```

### ESLint

Your code editor, depending on its configuration, may underline WDIO specific globals in red. To fix this, we need to install the ESLint WDIO plugin.

```sh
npm install eslint-plugin-wdio --save-dev
```

`/.eslintrc.json`

```
{
    "plugins": [
        "wdio"
    ],
    "extends": [
        ...
        "plugin:wdio/recommended"
    ],
}
```

## Options

### Rollup Plugins

The [rollup.js](https://rollupjs.org/) library is used for bundling. Since each test is built from scratch Rollup needs context about any plugins you are using.

Type: `Array`

Default: []

Example:
```
// wdio.conf.js
const lwcService = require('wdio-lwc-service');
exports.config = {
  // ...
  services: [
      [lwcService, {
          plugins: [
              labelsResolver(),
          ]    
      }]
  ],
  // ...
};
```

## Getting Started

Now that setup is done, let's look at how an integration test can be written. In this example, we're going to verify our component triggers an event.

1. Focus our component `<c-search value="foo" onsearch={handleEnter}>`.
2. Set value to `foobar`.
3. Press Enter Key
4. Assert `<div>` contents are set.

```text
/src/modules
  /c                        (namespace)
    /search                 (component)
      /search.js
      /search.html
      /__wdio__
        /search.spec.js
        /integration        (namespace)
          /search           (spec component)
            /search.js
            /search.html
        /another            (another namespace)
          /helper           (component)
```

> This example does not use additional namespaces, but are illustrated above if an integration test requires them.

### Component

The search component below offers an input box that wires up an `onsearch` event handler.

`src/modules/search/search.html`

```html
<template>
  <input value={value}
    onkeydown={handleKeyDown}
    onkeyup={handleChange}/>
  <button onclick={handleSearch}>Search</button>
</template>
```

`src/modules/search/search.js`

```javascript
import { LightningElement, api } from 'lwc';

export default class Greeting extends LightningElement {
  @api value = "";

  handleChange(event) {
    this.value = event.target.value;
  }

  handleKeyDown(event) {
    if (event.key === "Enter") {
      this.dispatchEvent(new CustomEvent('search', {
        target: { value: this.value }
      }));
    }
  }

  handleSearch() {
    this.dispatchEvent(new CustomEvent('search', {
      target: { value: this.value }
    }));
  }
}
```

### Integration Test

[Jasmine][jasmine] is used in the integration tests below.

`src/modules/search/__wdio__/integrations/search.html`

```html
<template>
    <c-search value={value} onsearch={handleSearch}></c-search>
    <div>Searched: {searched}</div>
</template>
```

`src/modules/search/__wdio__/integrations/search.js`

```javascript
import { LightningElement, track } from 'lwc';

export default class Search extends LightningElement {
  @track value = "foo";
  @track searched = "";

  handleSearch(event) {
    this.searched = event.target.value;
  }
}
```

`src/modules/search/__wdio__/search.spec.js`

```javascript
describe('Search input', () => {
    beforeEach(() => {
        browser.url(URL);
    });

    it('should init', () => {
        const divText = $("div").getText();
        expect(divText).toBe("Searched:");
    });

    it('should focus, enter value and fire onsearch event', () => {
        const cmp = $("my-search");
        const input = cmp.shadow$("input");
        input.setValue('foobar');
        browser.keys('Enter');
        // Verify div contains "Searched: foobar"
        const divText = $("div").getText();
        expect(divText).toBe("Searched: foobar");
    });

    // Additional test cases would go here
});
```

Below is a quick list explaining the methods above.

- [`browser.url`][wdio-url] Navigates the page to the test.
- [`$`][wdio-dollar] Fetches a single element with a query selector.
- [`element.setValue`][wdio-setvalue] Focuses element and inputs value.
- [`element.getText`][wdio-gettext] Gets visible text.
- [`browser.keys`][wdio-keys] Simulates key presses.
- [`browser.debug();`][wdio-debug] Triggers a breakpoint. Use the console to view variables and continue execution.

Now execute your tests with the script you added earlier in `package.json`.

```sh
npm run test:wdio
```

## Help

For any questions on integration testing please ask on the [Salesforce Stackexchange][stackexchange] and tag it with `lightning-web-components`.

[webdriverio]: https://webdriver.io/
[lwcdev]: https://lwc.dev/
[jasmine]: https://jasmine.github.io/
[test-framework]: https://webdriver.io/docs/frameworks.html
[stackexchange]: https://salesforce.stackexchange.com/questions/tagged/lightning-web-components
[selenium-standalone]: https://www.npmjs.com/package/selenium-standalone
[wdio-conf]: https://github.com/salesforce/wdio-lwc-service/blob/master/examples/basic/wdio.conf.js
[wdio-dollar]: https://webdriver.io/docs/api/browser/$.html
[wdio-debug]: https://webdriver.io/docs/debugging.html#the-debug-command
[wdio-keys]: https://webdriver.io/docs/api/browser/keys.html
[wdio-setvalue]: https://webdriver.io/docs/api/element/setValue.html
[wdio-gettext]: https://webdriver.io/docs/api/element/getText.html
[wdio-url]: https://webdriver.io/docs/api/browser/url.html
[package-json]: https://github.com/salesforce/wdio-lwc-service/blob/master/examples/basic/package.json#L16
[test]: https://lwc.dev/guide/test