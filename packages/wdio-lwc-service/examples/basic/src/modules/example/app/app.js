import { LightningElement, track } from 'lwc';

export default class App extends LightningElement {
    @track foo = 'World';

    handleClick() {
        this.foo = 'LWC';
    }
}
