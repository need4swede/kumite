import pytest
from solution import validate_password


def test_valid_passwords():
    result = validate_password("Pass123!")
    assert result["valid"] is True
    assert result["errors"] == []

    result = validate_password("Secure@2024")
    assert result["valid"] is True
    assert result["errors"] == []

    result = validate_password("MyP@ssw0rd")
    assert result["valid"] is True
    assert result["errors"] == []


def test_too_short():
    result = validate_password("Ab1!")
    assert result["valid"] is False
    assert "Must be at least 8 characters long" in result["errors"]


def test_missing_uppercase():
    result = validate_password("password123!")
    assert result["valid"] is False
    assert "Must contain at least one uppercase letter" in result["errors"]


def test_missing_lowercase():
    result = validate_password("PASSWORD123!")
    assert result["valid"] is False
    assert "Must contain at least one lowercase letter" in result["errors"]


def test_missing_digit():
    result = validate_password("Password!")
    assert result["valid"] is False
    assert "Must contain at least one digit" in result["errors"]


def test_missing_special():
    result = validate_password("Password123")
    assert result["valid"] is False
    assert "Must contain at least one special character" in result["errors"]


def test_multiple_errors():
    result = validate_password("pass")
    assert result["valid"] is False
    assert len(result["errors"]) == 4
    assert "Must be at least 8 characters long" in result["errors"]
    assert "Must contain at least one uppercase letter" in result["errors"]
    assert "Must contain at least one digit" in result["errors"]
    assert "Must contain at least one special character" in result["errors"]


def test_empty_password():
    result = validate_password("")
    assert result["valid"] is False
    assert len(result["errors"]) == 5
