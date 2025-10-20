const validatePassword = require('./solution');

describe('validatePassword', () => {
    test('valid passwords', () => {
        let result = validatePassword('Pass123!');
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);

        result = validatePassword('Secure@2024');
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);

        result = validatePassword('MyP@ssw0rd');
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
    });

    test('too short', () => {
        const result = validatePassword('Ab1!');
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Must be at least 8 characters long');
    });

    test('missing uppercase', () => {
        const result = validatePassword('password123!');
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Must contain at least one uppercase letter');
    });

    test('missing lowercase', () => {
        const result = validatePassword('PASSWORD123!');
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Must contain at least one lowercase letter');
    });

    test('missing digit', () => {
        const result = validatePassword('Password!');
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Must contain at least one digit');
    });

    test('missing special', () => {
        const result = validatePassword('Password123');
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Must contain at least one special character');
    });

    test('multiple errors', () => {
        const result = validatePassword('pass');
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBe(4);
        expect(result.errors).toContain('Must be at least 8 characters long');
        expect(result.errors).toContain('Must contain at least one uppercase letter');
        expect(result.errors).toContain('Must contain at least one digit');
        expect(result.errors).toContain('Must contain at least one special character');
    });

    test('empty password', () => {
        const result = validatePassword('');
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBe(5);
    });
});
