/* eslint-disable no-undef */
describe('Jasmine Example', () => {
    beforeEach(async () => {
        await browser.url('http://localhost:3000/basic');
    });

    it('should match full page snapshot', async () => {
        const result = await browser.checkFullPageScreen('fullPage', {
            /* options */
        });
        expect(result).toBeLessThan(0.05); // or your desired threshold
    });

    //   it('should save some screenshots', async () => {
    //       // Save a screen
    //       await browser.saveScreen('basicPage', {
    //           /* some options */
    //       })

    //       // Save an element
    //       await browser.saveElement(
    //           await $('#element-id'),
    //           'firstButtonElement',
    //           {
    //               /* some options */
    //           }
    //       )

    //       // Save a full page screenshot
    //       await browser.saveFullPageScreen('fullPage', {
    //           /* some options */
    //       })

    //       // Save a full page screenshot with all tab executions
    //       await browser.saveTabbablePage('save-tabbable', {
    //           /* some options, use the same options as for saveFullPageScreen */
    //       })
    //   })

    //   it('should compare successful with a baseline', async () => {
    //       // Check a screen
    //       await expect(
    //           await browser.checkScreen('basicPage', {
    //               /* some options */
    //           })
    //       ).toEqual(0)

    //       // Check an element
    //       await expect(
    //           await browser.checkElement(
    //               await $('#element-id'),
    //               'firstButtonElement',
    //               {
    //                   /* some options */
    //               }
    //           )
    //       ).toEqual(0)

    //       // Check a full page screenshot
    //       await expect(
    //           await browser.checkFullPageScreen('fullPage', {
    //               /* some options */
    //           })
    //       ).toEqual(0)

    //       // Check a full page screenshot with all tab executions
    //       await expect(
    //           await browser.checkTabbablePage('check-tabbable', {
    //               /* some options, use the same options as for checkFullPageScreen */
    //           })
    //       ).toEqual(0)
    //   })
});
