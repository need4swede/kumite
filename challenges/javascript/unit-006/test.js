const { factorial } = require('./app');

const CASES = [
  [0, 1],
  [1, 1],
  [3, 6],
  [5, 120],
  [7, 5040],
  [10, 3628800],
];

describe('factorial', () => {
  CASES.forEach(([n, expected]) => {
    test(`returns ${expected} for ${n}`, () => {
      expect(factorial(n)).toBe(expected);
    });
  });
});
