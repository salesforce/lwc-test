// Minimal polyfill for ARIA string reflection, e.g. aria-label -> ariaLabel.
// As of this writing, ARIA string reflection is supported in Chrome and Safari, but not Firefox or JSDOM.
// TODO: remove after JSDOM merges this PR: https://github.com/jsdom/jsdom/pull/3586

// ARIA Element properties that reflect to strings (not Element or FrozenArray<Element>)
// https://w3c.github.io/aria/#ARIAMixin
const ARIA_STRING_PROPS = [
    'role',
    'ariaAtomic',
    'ariaAutoComplete',
    'ariaBusy',
    'ariaChecked',
    'ariaColCount',
    'ariaColIndex',
    'ariaColIndexText',
    'ariaColSpan',
    'ariaCurrent',
    'ariaDescription',
    'ariaDisabled',
    'ariaExpanded',
    'ariaHasPopup',
    'ariaHidden',
    'ariaInvalid',
    'ariaKeyShortcuts',
    'ariaLabel',
    'ariaLevel',
    'ariaLive',
    'ariaModal',
    'ariaMultiLine',
    'ariaMultiSelectable',
    'ariaOrientation',
    'ariaPlaceholder',
    'ariaPosInSet',
    'ariaPressed',
    'ariaReadOnly',
    'ariaRequired',
    'ariaRoleDescription',
    'ariaRowCount',
    'ariaRowIndex',
    'ariaRowIndexText',
    'ariaRowSpan',
    'ariaSelected',
    'ariaSetSize',
    'ariaSort',
    'ariaValueMax',
    'ariaValueMin',
    'ariaValueNow',
    'ariaValueText',
];

for (const prop of ARIA_STRING_PROPS) {
    if (!(prop in Element.prototype)) {
        // sniff for support
        // e.g. `ariaPosInSet` -> `aria-posinset`
        const attribute = prop.replace(/[A-Z]/, (letter) => `-${letter}`).toLowerCase();
        Object.defineProperty(Element.prototype, prop, {
            get() {
                return this.getAttribute(attribute);
            },
            set(value) {
                // Per the spec, only null is treated as removing the attribute. However, Chromium/WebKit currently
                // differ from the spec and allow undefined as well. Here, we follow the standard.
                // See: https://github.com/w3c/aria/issues/1858
                if (value === null) {
                    this.removeAttribute(attribute);
                } else {
                    this.setAttribute(attribute, value);
                }
            },
            // These props in both WebKit and Chromium are configurable/enumerable. This allows overriding
            // (Try `Object.getOwnPropertyDescriptor(Element.prototype, 'ariaLabel')` in either browser)
            configurable: true,
            enumerable: true,
        });
    }
}
