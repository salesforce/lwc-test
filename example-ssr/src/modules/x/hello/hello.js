import { LightningElement, track } from 'lwc';

export default class Greeting extends LightningElement {
    @track name = '';
    @track greetingMessage = '';

    handleInputChange(event) {
        this.name = event.target.value;
    }

    handleSubmit() {
        this.greetingMessage = `Hello, ${this.name}`;
    }
}
