describe('<example-app /> tests',() => {
    it('should init h1 text(Hello World!)', () => {
        browser.url(URL);
        const exampleApp = $('example-app');
        const h1 = exampleApp.shadow$('h1');
        expect(h1.getText()).toBe('Hello World!');
    });

    it('should match the h1 text(Hello LWC!) when click in the button', () => {
        browser.url(URL);
        const exampleApp = $('example-app');
        const button = exampleApp.shadow$('button');
        button.click();
        const h1 = exampleApp.shadow$('h1');
        expect(h1.getText()).toBe('Hello LWC!');
    });
});
