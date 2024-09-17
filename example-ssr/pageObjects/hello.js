
'use strict';

var core = require('@utam/core');

async function _utam_get_h1Content(driver, root) {
    let _element = root;
    const _locator = core.By.css("h1");
    _element = new core.ShadowRoot(driver, _element);
    return _element.findElement(_locator);
}

async function _utam_get_labelContent(driver, root) {
    let _element = root;
    const _locator = core.By.css("label");
    _element = new core.ShadowRoot(driver, _element);
    return _element.findElement(_locator);
}

async function _utam_get_name(driver, root) {
    let _element = root;
    const _locator = core.By.css("input#name");
    _element = new core.ShadowRoot(driver, _element);
    return _element.findElement(_locator);
}

async function _utam_get_button(driver, root) {
    let _element = root;
    const _locator = core.By.css("button");
    _element = new core.ShadowRoot(driver, _element);
    return _element.findElement(_locator);
}

async function _utam_get_pContent(driver, root) {
    let _element = root;
    const _locator = core.By.css("p");
    _element = new core.ShadowRoot(driver, _element);
    return _element.findElement(_locator);
}

/**
 * Page Object: hello
 * generated from JSON example-ssr/src/modules/x/hello/__utam__/hello.utam.json
 * @version 2024-09-23T20:21:55.431Z
 * @author UTAM generator
 */
class Hello extends core.UtamBaseRootPageObject {
    constructor(driver, element, locator = core.By.css("x-hello")) {
        super(driver, element, locator);
    }

    async __getRoot() {
        const driver = this.driver;
        const root = await this.getRootElement();
        const BaseUtamElement = core.createUtamMixinCtor();
        return new BaseUtamElement(driver, root);
    }
    
    async getH1Content() {
        const driver = this.driver;
        const root = await this.getRootElement();
        const BaseUtamElement = core.createUtamMixinCtor();
        let element = await _utam_get_h1Content(driver, root);
        element = new BaseUtamElement(driver, element);
        return element;
    }
    
    async getLabelContent() {
        const driver = this.driver;
        const root = await this.getRootElement();
        const BaseUtamElement = core.createUtamMixinCtor();
        let element = await _utam_get_labelContent(driver, root);
        element = new BaseUtamElement(driver, element);
        return element;
    }
    
    async getName() {
        const driver = this.driver;
        const root = await this.getRootElement();
        const ActionableClickableEditableUtamElement = core.createUtamMixinCtor(core.ActionableUtamElement, core.ClickableUtamElement, core.EditableUtamElement);
        let element = await _utam_get_name(driver, root);
        element = new ActionableClickableEditableUtamElement(driver, element);
        return element;
    }
    
    async getButton() {
        const driver = this.driver;
        const root = await this.getRootElement();
        const ActionableClickableUtamElement = core.createUtamMixinCtor(core.ActionableUtamElement, core.ClickableUtamElement);
        let element = await _utam_get_button(driver, root);
        element = new ActionableClickableUtamElement(driver, element);
        return element;
    }
    
    async getPContent() {
        const driver = this.driver;
        const root = await this.getRootElement();
        const BaseUtamElement = core.createUtamMixinCtor();
        let element = await _utam_get_pContent(driver, root);
        element = new BaseUtamElement(driver, element);
        return element;
    }
    
}

module.exports = Hello;
