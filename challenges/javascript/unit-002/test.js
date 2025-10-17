const { hasLigma } = require('./app');

const CASES = [
  ["ligma", true],
  ["lgima", false],
  ["liggma", false],
  ["1234ligma lis;h", true],
  ["1234lGmia ;k", false],
  ["LigMa", true],
  ["lIgMa", true],
  ["1234#$%%LiGmA ;k9", true],
  ["LGmIA", false],
  ["1234liglihs**", false],
  ["", false],
];

describe('hasLigma', () => {
  CASES.forEach(([s, expected]) => {
    test(`should return ${expected} for "${s}"`, () => {
      expect(hasLigma(s)).toBe(expected);
    });
  });
});
