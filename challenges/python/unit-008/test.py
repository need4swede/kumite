import pytest
from solution import parse_duration


def test_single_units():
    assert parse_duration("45 seconds") == 45
    assert parse_duration("5 minutes") == 300
    assert parse_duration("2 hours") == 7200
    assert parse_duration("1 day") == 86400


def test_abbreviated_units():
    assert parse_duration("30s") == 30
    assert parse_duration("10m") == 600
    assert parse_duration("1h") == 3600
    assert parse_duration("2d") == 172800


def test_multiple_units():
    assert parse_duration("2 hours 30 minutes") == 9000
    assert parse_duration("1 day 3 hours 15 mins") == 97500
    assert parse_duration("2h 30m 15s") == 9015
    assert parse_duration("1 day, 2 hours, 30 minutes, 45 seconds") == 95445


def test_case_insensitive():
    assert parse_duration("2 HOURS 30 MINUTES") == 9000
    assert parse_duration("1 Day 5 Hours") == 104400
    assert parse_duration("3H 20M") == 12000


def test_plural_and_singular():
    assert parse_duration("1 second") == 1
    assert parse_duration("2 seconds") == 2
    assert parse_duration("1 minute") == 60
    assert parse_duration("2 minutes") == 120


def test_mixed_formats():
    assert parse_duration("1hr 30min") == 5400
    assert parse_duration("2 hrs, 15 secs") == 7215
    assert parse_duration("1 day 12h") == 129600


def test_edge_cases():
    assert parse_duration("") == 0
    assert parse_duration("0 seconds") == 0
    assert parse_duration("invalid input") == 0
