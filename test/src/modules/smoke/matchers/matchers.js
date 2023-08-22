import { LightningElement, api } from 'lwc';

export default class Matchers extends LightningElement {
    @api
    throwInConnectedCallback;

    connectedCallback() {
        if (this.throwInConnectedCallback) {
            throw new ReferenceError('This is an error thrown from connectedCallback');
        }
    }
}
