import unittest
from app import factorial

CASES = [
    (0, 1),
    (1, 1),
    (3, 6),
    (5, 120),
    (7, 5040),
    (10, 3628800),
]


class TestFactorial(unittest.TestCase):
    def test_cases(self):
        for n, expected in CASES:
            with self.subTest(n=n):
                self.assertEqual(factorial(n), expected)


if __name__ == "__main__":
    unittest.main()
