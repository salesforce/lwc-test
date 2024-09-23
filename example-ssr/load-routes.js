const hydrate = ['x/hello'];

class RoutesPlugin {
    onStart(config) {
        // SSR-only components
        // ssr.forEach((cmp) => {
        //     const tag = cmp.replace('/', '-');
        //     config.routes.push({
        //         id: `${tag}-route`,
        //         path: `/${tag}`,
        //         rootComponent: cmp, // rootComponents are not hydrated by default
        //         bootstrap: { ssr: true },
        //     });
        // });

        // SSR and hydrated components
        hydrate.forEach((cmp) => {
            const tag = cmp.replace('/', '-');
            config.routes.push({
                id: `${tag}-route`,
                path: `/${tag}`,
                contentTemplate: `${__dirname}/src/content/hydrate.html`, // adds the lwr:hydrate directive
                bootstrap: { ssr: true },
                properties: { tag },
            });
        });
    }
}

module.exports = RoutesPlugin;
