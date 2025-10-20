Write a function that validates whether a password meets security requirements.

A valid password must satisfy ALL of the following conditions:

1. At least 8 characters long
2. Contains at least one uppercase letter (A-Z)
3. Contains at least one lowercase letter (a-z)
4. Contains at least one digit (0-9)
5. Contains at least one special character from: `!@#$%^&*()-+`

The function should return a dictionary with two keys:
- `"valid"`: A boolean indicating whether the password is valid
- `"errors"`: A list of error messages for each failed requirement (empty list if valid)

## Input

Input will be a string representing the password to validate, e.g., `"Pass123!"`.

## Output

Output should be a dictionary with validation results, e.g.:
```python
{"valid": True, "errors": []}
```

or for an invalid password:
```python
{"valid": False, "errors": ["Must be at least 8 characters long", "Must contain at least one special character"]}
```
