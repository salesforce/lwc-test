beforeEach(() => {
    process.env.SSR = 'true';
});

afterEach(() => {
    delete process.env.SSR;
});
