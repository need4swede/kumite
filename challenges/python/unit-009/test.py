import pytest
from solution import to_roman


def test_single_digits():
    assert to_roman(1) == "I"
    assert to_roman(3) == "III"
    assert to_roman(4) == "IV"
    assert to_roman(5) == "V"
    assert to_roman(9) == "IX"


def test_tens():
    assert to_roman(10) == "X"
    assert to_roman(27) == "XXVII"
    assert to_roman(40) == "XL"
    assert to_roman(50) == "L"
    assert to_roman(90) == "XC"


def test_hundreds():
    assert to_roman(100) == "C"
    assert to_roman(400) == "CD"
    assert to_roman(500) == "D"
    assert to_roman(900) == "CM"


def test_thousands():
    assert to_roman(1000) == "M"
    assert to_roman(3000) == "MMM"


def test_complex_numbers():
    assert to_roman(58) == "LVIII"
    assert to_roman(1994) == "MCMXCIV"
    assert to_roman(2024) == "MMXXIV"
    assert to_roman(3749) == "MMMDCCXLIX"
    assert to_roman(444) == "CDXLIV"
