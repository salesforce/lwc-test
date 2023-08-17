// Ensure that basic ARIA string reflection works
// TODO: remove after JSDOM merges this PR: https://github.com/jsdom/jsdom/pull/3586

// ARIA Element properties that reflect to strings (not Element or FrozenArray<Element>)
// https://w3c.github.io/aria/#ARIAMixin
const ARIA_STRING_PROPS_TO_ATTRS = {
    role: 'role',
    ariaAtomic: 'aria-atomic',
    ariaAutoComplete: 'aria-autocomplete',
    ariaBusy: 'aria-busy',
    ariaChecked: 'aria-checked',
    ariaColCount: 'aria-colcount',
    ariaColIndex: 'aria-colindex',
    ariaColIndexText: 'aria-colindextext',
    ariaColSpan: 'aria-colspan',
    ariaCurrent: 'aria-current',
    ariaDescription: 'aria-description',
    ariaDisabled: 'aria-disabled',
    ariaExpanded: 'aria-expanded',
    ariaHasPopup: 'aria-haspopup',
    ariaHidden: 'aria-hidden',
    ariaInvalid: 'aria-invalid',
    ariaKeyShortcuts: 'aria-keyshortcuts',
    ariaLabel: 'aria-label',
    ariaLevel: 'aria-level',
    ariaLive: 'aria-live',
    ariaModal: 'aria-modal',
    ariaMultiLine: 'aria-multiline',
    ariaMultiSelectable: 'aria-multiselectable',
    ariaOrientation: 'aria-orientation',
    ariaPlaceholder: 'aria-placeholder',
    ariaPosInSet: 'aria-posinset',
    ariaPressed: 'aria-pressed',
    ariaReadOnly: 'aria-readonly',
    ariaRequired: 'aria-required',
    ariaRoleDescription: 'aria-roledescription',
    ariaRowCount: 'aria-rowcount',
    ariaRowIndex: 'aria-rowindex',
    ariaRowIndexText: 'aria-rowindextext',
    ariaRowSpan: 'aria-rowspan',
    ariaSelected: 'aria-selected',
    ariaSetSize: 'aria-setsize',
    ariaSort: 'aria-sort',
    ariaValueMax: 'aria-valuemax',
    ariaValueMin: 'aria-valuemin',
    ariaValueNow: 'aria-valuenow',
    ariaValueText: 'aria-valuetext',
};

describe('ARIA string reflection', () => {
    for (const [prop, attribute] of Object.entries(ARIA_STRING_PROPS_TO_ATTRS)) {
        it(attribute, () => {
            const div = document.createElement('div');

            div.setAttribute(attribute, 'foo');
            expect(div[prop]).toBe('foo');

            div[prop] = null;
            expect(div.getAttribute(attribute)).toBeNull();
        });
    }
});
