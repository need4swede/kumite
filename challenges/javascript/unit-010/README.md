Write a function that validates whether a password meets security requirements.

A valid password must satisfy ALL of the following conditions:

1. At least 8 characters long
2. Contains at least one uppercase letter (A-Z)
3. Contains at least one lowercase letter (a-z)
4. Contains at least one digit (0-9)
5. Contains at least one special character from: `!@#$%^&*()-+`

The function should return an object with two keys:
- `valid`: A boolean indicating whether the password is valid
- `errors`: An array of error messages for each failed requirement (empty array if valid)

## Input

Input will be a string representing the password to validate, e.g., `"Pass123!"`.

## Output

Output should be an object with validation results, e.g.:
```javascript
{valid: true, errors: []}
```

or for an invalid password:
```javascript
{valid: false, errors: ["Must be at least 8 characters long", "Must contain at least one special character"]}
```
