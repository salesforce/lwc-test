import { LightningElement, api } from 'lwc';

// This component won't fully compile because it's not in lightning or interop namespace (namespace = smoke)
export default class PrivateMethods extends LightningElement {
    @api value = 0;
    counter = 0;

    #incrementPrivate() {
        this.counter++;
        return this.counter;
    }

    @api
    publicMethod() {
        // Call private method from public method
        const count = this.#incrementPrivate();
        this.value = count;
        return count;
    }

    @api
    getCounter() {
        return this.counter;
    }
}
