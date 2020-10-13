const { test } = require('../index');

describe('@lwc/jest-serializer', () => {
    describe('and "test" method', () => {
        const nodeTypeArr = [
            ['undefined', undefined, false],
            ['null', null, false],
            ['empty object', { }, false],
            ['without the nodeType property', { anotherKindOfProperty: 5 }, false],
            ['with an element node type', { nodeType: 1 }, true],
            ['with a text node type', { nodeType: 3 }, true],
            ['with a comment node type', { nodeType: 6 }, true],
            ['with another kind of node type', { nodeType: 2 }, false],
        ];

        it.each(nodeTypeArr)('should return the expected state when we have %s', (useCase, input, expected) => {
            expect(test(input)).toEqual(expected);
        });
    });
});