import unittest
from app import positive_sum

CASES = [
    ([1, -4, 7, 12], 20),
    ([-1, -2, -3, -4], 0),
    ([0, 1, 2, 3], 6),
    ([5, 5, 5, -5], 15),
    ([10], 10),
    ([], 0),
    ([0, 0, 0], 0),
    ([-10, 4, 3, -2, 0], 7),
]


class TestPositiveSum(unittest.TestCase):
    def test_cases(self):
        for numbers, expected in CASES:
            with self.subTest(numbers=numbers):
                self.assertEqual(positive_sum(numbers), expected)


if __name__ == "__main__":
    unittest.main()
