import unittest
from app import count_vowels

CASES = [
    ("hello world", 3),
    ("xyz", 0),
    ("AEIOU", 5),
    ("", 0),
    ("The quick brown fox.", 5),
    ("Why so serious?", 5),
    ("PYTHON programming", 4),
    ("1234!?", 0),
]


class TestCountVowels(unittest.TestCase):
    def test_cases(self):
        for text, expected in CASES:
            with self.subTest(text=text):
                self.assertEqual(count_vowels(text), expected)


if __name__ == "__main__":
    unittest.main()
