const { shortenToDate } = require('./app');

const CASES = [
  ["Monday February 2, 8pm", "Monday February 2"],
  ["Tuesday May 29, 8pm", "Tuesday May 29"],
  ["Wed September 1, 3am", "Wed September 1"],
  ["Friday May 2, 9am", "Friday May 2"],
  ["Tuesday January 29, 10pm", "Tuesday January 29"],
];

describe('shortenToDate', () => {
  CASES.forEach(([longDate, expected]) => {
    test(`should return "${expected}" for "${longDate}"`, () => {
      expect(shortenToDate(longDate)).toBe(expected);
    });
  });
});
