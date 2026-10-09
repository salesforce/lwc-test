const { unwrap } = require('@lwc/engine-dom');

const originalConsole = global.console;
const augmentedConsole = {
    ...global.console,
};

['log', 'info', 'err', 'dir', 'warn', 'debug'].forEach((methodName) => {
    augmentedConsole[methodName] = (...args) => {
        originalConsole[methodName](...args.map(unwrap));
    };
});

global.console = augmentedConsole;
