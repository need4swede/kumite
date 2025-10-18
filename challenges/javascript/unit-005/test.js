const { countVowels } = require('./app');

const CASES = [
  ['hello world', 3],
  ['xyz', 0],
  ['AEIOU', 5],
  ['', 0],
  ['The quick brown fox.', 5],
  ['Why so serious?', 5],
  ['PYTHON programming', 4],
  ['1234!?', 0],
];

describe('countVowels', () => {
  CASES.forEach(([text, expected]) => {
    test(`returns ${expected} for "${text}"`, () => {
      expect(countVowels(text)).toBe(expected);
    });
  });
});
