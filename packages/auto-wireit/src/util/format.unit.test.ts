import { format } from './format.js';

describe('format unit tests', () => {
    test.each([
        {
            input: '',
            output: '',
            args: [],
        },
        {
            input: '%s %s %s0 %s2 %j4 %j3 %b12',
            output: 'a b a c {"b":2} {"a":1} %b12',
            args: ['a', 'b', 'c', { a: 1 }, { b: 2 }],
        },
        {
            input: '%s %s %s %j %j %j %j %j',
            output: 'a b c {"a":1} {"b":2} null undefined [Function]',
            args: ['a', 'b', 'c', { a: 1, fn: () => 'abc' }, { b: 2, c: undefined }, null, undefined, () => 'abc'],
        },
    ])('"$input" => "$output", args: $args', async ({ input, output, args }) => {
        // Act
        expect(format(input, ...args)).toEqual(output);
    });
});
