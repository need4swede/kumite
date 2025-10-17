import unittest
from app import fizzbuzz

CASES = [
    (0, []),
    (-4, []),
    (1, ["1"]),
    (5, ["1", "2", "Fizz", "4", "Buzz"]),
    (
        15,
        [
            "1",
            "2",
            "Fizz",
            "4",
            "Buzz",
            "Fizz",
            "7",
            "8",
            "Fizz",
            "Buzz",
            "11",
            "Fizz",
            "13",
            "14",
            "FizzBuzz",
        ],
    ),
]


class TestFizzBuzz(unittest.TestCase):
    def test_cases(self):
        for n, expected in CASES:
            with self.subTest(n=n):
                self.assertEqual(fizzbuzz(n), expected)


if __name__ == "__main__":
    unittest.main()
