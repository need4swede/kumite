const { fizzBuzz } = require('./app');

const CASES = [
  [0, []],
  [-4, []],
  [1, ['1']],
  [5, ['1', '2', 'Fizz', '4', 'Buzz']],
  [
    15,
    [
      '1',
      '2',
      'Fizz',
      '4',
      'Buzz',
      'Fizz',
      '7',
      '8',
      'Fizz',
      'Buzz',
      '11',
      'Fizz',
      '13',
      '14',
      'FizzBuzz',
    ],
  ],
];

describe('fizzBuzz', () => {
  CASES.forEach(([n, expected]) => {
    test(`returns ${JSON.stringify(expected)} for ${n}`, () => {
      expect(fizzBuzz(n)).toEqual(expected);
    });
  });
});
