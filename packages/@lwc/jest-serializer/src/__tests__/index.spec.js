const { test } = require('../index');

describe('@lwc/jest-serializer', () => {
    describe('and "test" method', () => {
        const nodeTypeArr = [
            ['undefined', undefined, false],
            ['null', null, false],
            ['empty object', { }, false],
            ['without the nodeType property', { anotherKindOfProperty: 5 }, false],
            ['with an element node type', document.createElement('div'), true],
            ['with a text node type', document.createTextNode(''), true],
            ['with a comment node type', document.createComment(''), true],
            ['with another kind of node type', document.createAttribute('foo'), false],
        ];

        it.each(nodeTypeArr)('should return the expected state when we have %s', (useCase, input, expected) => {
            expect(test(input)).toEqual(expected);
        });
    });
});