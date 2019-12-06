describe('serialized element attributes', () => {
    it('should replace both id and for attributes with placeholders', () => {
        const elm = document.createElement('div');
        elm.innerHTML = `
            <label for="cheese">Do you like cheese?</label>
            <input type="checkbox" name="cheese" id="cheese">
        `.replace(/\s+/g, ' ');
        expect(elm).toMatchSnapshot();
    });

    it('should replace all id-referencing aria attributes with placeholders', () => {
        const elm = document.createElement('div');
        elm.innerHTML = `
            <div aria-activedescendant="aria-activedescendant">aria-activedescendant</div>
            <div aria-controls="aria-controls">aria-controls</div>
            <div aria-describedby="aria-describedby">aria-describedby</div>
            <div aria-details="aria-details">aria-details</div>
            <div aria-errormessage="aria-errormessage">aria-errormessage</div>
            <div aria-flowto="aria-flowto">aria-flowto</div>
            <div aria-labelledby="aria-labelledby">aria-labelledby</div>
            <div aria-owns="aria-owns">aria-owns</div>
        `.replace(/\s+/g, ' ');
        expect(elm).toMatchSnapshot();
    });

    it('should remove the lwc:host attribute', () => {
        const elm = document.createElement('div');
        elm.innerHTML = `
            <div lwc:host="12345">12345</div>
            <div lwc:host="abcde">abcde</div>
        `.replace(/\s+/g, ' ');
        expect(elm).toMatchSnapshot();
    });

    it('should replace the href attribute with a placeholder if it is a fragment id for anchor tags', () => {
        const elm = document.createElement('div');
        elm.innerHTML = `
            <a href="#ny-state-of-mind">ny state of mind</a>
            <a href="https://nystateofmind.com">ny state of mind</a>
        `.replace(/\s+/g, ' ');
        expect(elm).toMatchSnapshot();
    });

    it('should replace the href attribute with a placeholder if it is a fragment id for area tags', () => {
        const elm = document.createElement('div');
        elm.innerHTML = `
            <map name="kyoto">
                <area href="#teramachi"/>
                <area href="#kawaramachi"/>
                <area href="https://duckduckgo.com/?q=kyoto"/>
            </map>
        `.replace(/\s+/g, ' ');
        expect(elm).toMatchSnapshot();
    });

    it('should replace the href and xlink:href attributes with placeholders if it is a fragment id for svg use tags', () => {
        const elm = document.createElement('div');
        elm.innerHTML = `
            <svg width="100px" height="100px" viewport="0 0 100 100">
                <defs>
                    <circle id="black" r="10" cx="10" cy="10" fill="black"></circle>
                    <circle id="red" r="10" cx="14" cy="14" fill="red"></circle>
                </defs>
                <use href="#black"></use>
                <use xlink:href="#red"></use>
            </svg>
        `.replace(/\s+/g, ' ');
        expect(elm).toMatchSnapshot();
    });
});
