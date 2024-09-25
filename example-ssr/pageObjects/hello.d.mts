
import { Driver as _Driver, Element as _Element, Locator as _Locator, BaseUtamElement as _BaseUtamElement, UtamBaseRootPageObject as _UtamBaseRootPageObject, ActionableUtamElement as _ActionableUtamElement, ClickableUtamElement as _ClickableUtamElement, EditableUtamElement as _EditableUtamElement } from '@utam/core';

/**
 * Page Object: hello
 * generated from JSON example-ssr/src/modules/x/hello/__utam__/hello.utam.json
 * @version 2024-09-25T18:37:28.827Z
 * @author UTAM generator
 */
export default class Hello extends _UtamBaseRootPageObject {
    constructor(driver: _Driver, element?: _Element, locator?: _Locator);
    getH1Content(): Promise<(_BaseUtamElement)>;
    getLabelContent(): Promise<(_BaseUtamElement)>;
    getName(): Promise<(_BaseUtamElement & _ActionableUtamElement & _ClickableUtamElement & _EditableUtamElement)>;
    getButton(): Promise<(_BaseUtamElement & _ActionableUtamElement & _ClickableUtamElement)>;
    getPContent(): Promise<(_BaseUtamElement)>;
}