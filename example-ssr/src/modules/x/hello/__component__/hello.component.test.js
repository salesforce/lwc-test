import Hello from '../../../../../pageObjects/hello';


describe('Jasmine Example', () => {
   let helloPage;

    beforeAll(async () => {
        await browser.url('/hello');
        helloPage = await utam.load(Hello)
    });

    it('should display a greeting message after submitting a name', async () => {
    
        expect(helloPage).not.toBeNull();
       
    });
});
