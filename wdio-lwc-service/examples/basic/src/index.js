import { createElement } from 'lwc';
import App from 'example/app';

document
    .querySelector('#main')
    .appendChild(createElement('example-app', { is: App, fallback: false }));
