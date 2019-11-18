if (!Object.getOwnPropertyDescriptor(Node.prototype, '$shadowResolver$')) {
    // We should ideally use getModulePath from the "lwc" package here but our
    // resolver maps that identifier to @lwc/engine!
    require('@lwc/synthetic-shadow/dist/synthetic-shadow.js');
}
