import { createElement } from 'lwc';
import Matchers from '../matchers';

class ThirdParty extends HTMLElement {
    throwInConnectedCallback;

    connectedCallback() {
        if (this.throwInConnectedCallback) {
            throw new ReferenceError('This is an error thrown from connectedCallback');
        }
    }
}

customElements.define('third-party', ThirdParty);

describe('matchers', () => {
    [false, true].forEach((isThirdParty) => {
        describe(`isThirdParty=${isThirdParty}`, () => {
            const doCreateElement = () => {
                return isThirdParty
                    ? new ThirdParty()
                    : createElement('smoke-matchers', {
                          is: Matchers,
                      });
            };
            [false, true].forEach((shouldThrow) => {
                describe(`shouldThrow=${shouldThrow}`, () => {
                    let elm;
                    let callback;

                    beforeEach(() => {
                        elm = doCreateElement();
                        elm.throwInConnectedCallback = shouldThrow;
                        callback = () => {
                            document.body.appendChild(elm);
                        };
                    });

                    [
                        { argsType: 'no args', args: [] },
                        { argsType: 'string', args: ['error thrown from connectedCallback'] },
                        { argsType: 'regex', args: [/error thrown from connectedCallback/] },
                        { argsType: 'error class', args: [ReferenceError] },
                        {
                            argsType: 'error object',
                            args: [new Error('This is an error thrown from connectedCallback')],
                        },
                    ].forEach(({ argsType, args }) => {
                        describe(`args=${argsType}`, () => {
                            // happy path - error is thrown and we expect it, or not thrown and we expect that
                            it('test passes', () => {
                                if (shouldThrow) {
                                    expect(callback).toThrowInConnectedCallback(...args);
                                } else {
                                    expect(callback).not.toThrowInConnectedCallback(...args);
                                }
                            });

                            // inverse of above - error and we don't expect it, or vice-versa
                            it('test fails', () => {
                                expect(() => {
                                    if (shouldThrow) {
                                        expect(callback).not.toThrowInConnectedCallback(...args);
                                    } else {
                                        expect(callback).toThrowInConnectedCallback(...args);
                                    }
                                }).toThrow(/Expected connectedCallback/);
                            });
                        });
                    });

                    // error thrown and we expect an error, but the matcher fails
                    describe('test fails due to matcher failing', () => {
                        [
                            { argsType: 'string', args: ['yolo'] },
                            { argsType: 'regex', args: [/hahaha/] },
                            { argsType: 'error class', args: [TypeError] },
                            { argsType: 'error object', args: [new Error('lalala')] },
                        ].forEach(({ argsType, args }) => {
                            it(argsType, () => {
                                if (shouldThrow) {
                                    // throws and the matcher does not match
                                    expect(() => {
                                        expect(callback).toThrowInConnectedCallback(...args);
                                    }).toThrow(/Expected connectedCallback/);
                                } else {
                                    // does not throw, so we ignore the matcher
                                    expect(callback).not.toThrowInConnectedCallback(...args);
                                }
                            });
                        });
                    });
                });
            });
        });
    });
});
