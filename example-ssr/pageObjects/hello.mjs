import {
    By as _By,
    ShadowRoot as _ShadowRoot,
    createUtamMixinCtor as _createUtamMixinCtor,
    UtamBaseRootPageObject as _UtamBaseRootPageObject,
    ActionableUtamElement as _ActionableUtamElement,
    ClickableUtamElement as _ClickableUtamElement,
    EditableUtamElement as _EditableUtamElement,
} from '@utam/core';

async function _utam_get_h1Content(driver, root) {
    let _element = root;
    const _locator = _By.css('h1');
    _element = new _ShadowRoot(driver, _element);
    return _element.findElement(_locator);
}

async function _utam_get_labelContent(driver, root) {
    let _element = root;
    const _locator = _By.css('label');
    _element = new _ShadowRoot(driver, _element);
    return _element.findElement(_locator);
}

async function _utam_get_name(driver, root) {
    let _element = root;
    const _locator = _By.css('input#name');
    _element = new _ShadowRoot(driver, _element);
    return _element.findElement(_locator);
}

async function _utam_get_button(driver, root) {
    let _element = root;
    const _locator = _By.css('button');
    _element = new _ShadowRoot(driver, _element);
    return _element.findElement(_locator);
}

async function _utam_get_pContent(driver, root) {
    let _element = root;
    const _locator = _By.css('p');
    _element = new _ShadowRoot(driver, _element);
    return _element.findElement(_locator);
}

/**
 * Page Object: hello
 * generated from JSON example-ssr/src/modules/x/hello/__utam__/hello.utam.json
 * @version 2024-09-25T05:52:12.812Z
 * @author UTAM generator
 */
export default class Hello extends _UtamBaseRootPageObject {
    constructor(driver, element, locator = _By.css('x-hello')) {
        super(driver, element, locator);
    }

    async __getRoot() {
        const driver = this.driver;
        const root = await this.getRootElement();
        const BaseUtamElement = _createUtamMixinCtor();
        return new BaseUtamElement(driver, root);
    }

    async getH1Content() {
        const driver = this.driver;
        const root = await this.getRootElement();
        const BaseUtamElement = _createUtamMixinCtor();
        let element = await _utam_get_h1Content(driver, root);
        element = new BaseUtamElement(driver, element);
        return element;
    }

    async getLabelContent() {
        const driver = this.driver;
        const root = await this.getRootElement();
        const BaseUtamElement = _createUtamMixinCtor();
        let element = await _utam_get_labelContent(driver, root);
        element = new BaseUtamElement(driver, element);
        return element;
    }

    async getName() {
        const driver = this.driver;
        const root = await this.getRootElement();
        const ActionableClickableEditableUtamElement = _createUtamMixinCtor(
            _ActionableUtamElement,
            _ClickableUtamElement,
            _EditableUtamElement
        );
        let element = await _utam_get_name(driver, root);
        element = new ActionableClickableEditableUtamElement(driver, element);
        return element;
    }

    async getButton() {
        const driver = this.driver;
        const root = await this.getRootElement();
        const ActionableClickableUtamElement = _createUtamMixinCtor(
            _ActionableUtamElement,
            _ClickableUtamElement
        );
        let element = await _utam_get_button(driver, root);
        element = new ActionableClickableUtamElement(driver, element);
        return element;
    }

    async getPContent() {
        const driver = this.driver;
        const root = await this.getRootElement();
        const BaseUtamElement = _createUtamMixinCtor();
        let element = await _utam_get_pContent(driver, root);
        element = new BaseUtamElement(driver, element);
        return element;
    }
}
