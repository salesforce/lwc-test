const { unwrap } = require('@lwc/engine-dom');

const originalConsole = global.console;
const augmentedConsole = {
    ...global.console,
};

['log', 'info', 'err', 'dir', 'warn', 'debug'].forEach((methodName) => {
    augmentedConsole[methodName] = (...args) => {
        originalConsole[methodName].apply(originalConsole, [
            ...Array.from(args).map((obj) => unwrap(obj)),
        ]);
    };
});

global.console = augmentedConsole;
