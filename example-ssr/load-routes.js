const ssrOnly = ['x/hello']; // SSR-only components
const ssrAndHydrate = ['x/hello']; // SSR and hydrated components

class RoutesPlugin {
    onStart(config) {
        // SSR-only components
        ssrOnly.forEach((cmp) => {
            const tag = cmp.replace('/', '-');
            config.routes.push({
                id: `${tag}-ssr-only`,
                path: `/${tag}-ssr-only`,
                rootComponent: cmp, // rootComponents are not hydrated by default
                bootstrap: { ssr: true }, // Enable SSR
            });
        });

        // SSR and hydrated components
        ssrAndHydrate.forEach((cmp) => {
            const tag = cmp.replace('/', '-');
            config.routes.push({
                id: `${tag}-hydrated`,
                path: `/${tag}-hydrated`,
                contentTemplate: `${__dirname}/src/content/hydrate.html`, // adds the lwr:hydrate directive
                bootstrap: { ssr: true }, // Enable SSR
                properties: { tag },
            });
        });
    }
}

module.exports = RoutesPlugin;
