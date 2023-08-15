// Ensure that basic ARIA string reflection works
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

describe('ARIA string reflection', () => {
    for (const prop of ARIA_STRING_PROPS) {
        // e.g. `ariaPosInSet` -> `aria-posinset`
        const attribute = prop.replace(/[A-Z]/, (letter) => `-${letter}`).toLowerCase();

        it(attribute, () => {
            const div = document.createElement('div');

            div.setAttribute(attribute, 'foo');
            expect(div[prop]).toBe('foo');

            div[prop] = null;
            expect(div.getAttribute(attribute)).toBeNull();
        });
    }
});
