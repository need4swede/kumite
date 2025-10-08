import unittest
from app import shorten_to_date

CASES = [
    ("Monday February 2, 8pm", "Monday February 2"),
    ("Tuesday May 29, 8pm", "Tuesday May 29"),
    ("Wed September 1, 3am", "Wed September 1"),
    ("Friday May 2, 9am", "Friday May 2"),
    ("Tuesday January 29, 10pm", "Tuesday January 29"),
]

class TestShortenToDate(unittest.TestCase):
    def test_cases(self):
        for long_date, expected in CASES:
            with self.subTest(long_date=long_date):
                self.assertEqual(shorten_to_date(long_date), expected)

if __name__ == "__main__":
    unittest.main()
