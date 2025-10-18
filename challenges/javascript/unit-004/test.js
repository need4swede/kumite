const { positiveSum } = require('./app');

const CASES = [
  [[1, -4, 7, 12], 20],
  [[-1, -2, -3, -4], 0],
  [[0, 1, 2, 3], 6],
  [[5, 5, 5, -5], 15],
  [[10], 10],
  [[], 0],
  [[0, 0, 0], 0],
  [[-10, 4, 3, -2, 0], 7],
];

describe('positiveSum', () => {
  CASES.forEach(([numbers, expected]) => {
    test(`returns ${expected} for ${JSON.stringify(numbers)}`, () => {
      expect(positiveSum(numbers)).toBe(expected);
    });
  });
});
