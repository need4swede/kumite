const parseDuration = require('./solution');

describe('parseDuration', () => {
    test('single units', () => {
        expect(parseDuration('45 seconds')).toBe(45);
        expect(parseDuration('5 minutes')).toBe(300);
        expect(parseDuration('2 hours')).toBe(7200);
        expect(parseDuration('1 day')).toBe(86400);
    });

    test('abbreviated units', () => {
        expect(parseDuration('30s')).toBe(30);
        expect(parseDuration('10m')).toBe(600);
        expect(parseDuration('1h')).toBe(3600);
        expect(parseDuration('2d')).toBe(172800);
    });

    test('multiple units', () => {
        expect(parseDuration('2 hours 30 minutes')).toBe(9000);
        expect(parseDuration('1 day 3 hours 15 mins')).toBe(97500);
        expect(parseDuration('2h 30m 15s')).toBe(9015);
        expect(parseDuration('1 day, 2 hours, 30 minutes, 45 seconds')).toBe(95445);
    });

    test('case insensitive', () => {
        expect(parseDuration('2 HOURS 30 MINUTES')).toBe(9000);
        expect(parseDuration('1 Day 5 Hours')).toBe(104400);
        expect(parseDuration('3H 20M')).toBe(12000);
    });

    test('plural and singular', () => {
        expect(parseDuration('1 second')).toBe(1);
        expect(parseDuration('2 seconds')).toBe(2);
        expect(parseDuration('1 minute')).toBe(60);
        expect(parseDuration('2 minutes')).toBe(120);
    });

    test('mixed formats', () => {
        expect(parseDuration('1hr 30min')).toBe(5400);
        expect(parseDuration('2 hrs, 15 secs')).toBe(7215);
        expect(parseDuration('1 day 12h')).toBe(129600);
    });

    test('edge cases', () => {
        expect(parseDuration('')).toBe(0);
        expect(parseDuration('0 seconds')).toBe(0);
        expect(parseDuration('invalid input')).toBe(0);
    });
});
