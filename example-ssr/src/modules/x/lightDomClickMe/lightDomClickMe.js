import { LightningElement, track } from 'lwc';

export default class LightDomClickMe extends LightningElement {
    static renderMode = 'light';
    @track message = 'Click the button to change this message!';

    handleClick() {
        this.message = 'You clicked the button!';
    }
}
