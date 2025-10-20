const toRoman = require('./solution');

describe('toRoman', () => {
    test('single digits', () => {
        expect(toRoman(1)).toBe('I');
        expect(toRoman(3)).toBe('III');
        expect(toRoman(4)).toBe('IV');
        expect(toRoman(5)).toBe('V');
        expect(toRoman(9)).toBe('IX');
    });

    test('tens', () => {
        expect(toRoman(10)).toBe('X');
        expect(toRoman(27)).toBe('XXVII');
        expect(toRoman(40)).toBe('XL');
        expect(toRoman(50)).toBe('L');
        expect(toRoman(90)).toBe('XC');
    });

    test('hundreds', () => {
        expect(toRoman(100)).toBe('C');
        expect(toRoman(400)).toBe('CD');
        expect(toRoman(500)).toBe('D');
        expect(toRoman(900)).toBe('CM');
    });

    test('thousands', () => {
        expect(toRoman(1000)).toBe('M');
        expect(toRoman(3000)).toBe('MMM');
    });

    test('complex numbers', () => {
        expect(toRoman(58)).toBe('LVIII');
        expect(toRoman(1994)).toBe('MCMXCIV');
        expect(toRoman(2024)).toBe('MMXXIV');
        expect(toRoman(3749)).toBe('MMMDCCXLIX');
        expect(toRoman(444)).toBe('CDXLIV');
    });
});
