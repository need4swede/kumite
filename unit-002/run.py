import unittest
from app import has_ligma

CASES = [
    ("ligma", True),
    ("lgima", False),
    ("liggma", False),
    ("1234ligma lis;h", True),
    ("1234lGmia ;k", False),
    ("LigMa", True),
    ("lIgMa", True),
    ("1234#$%%LiGmA ;k9", True),
    ("LGmIA", False),
    ("1234liglihs**", False),
    ("", False),
]

class TestSpEng(unittest.TestCase):
    def test_cases(self):
        for s, expected in CASES:
            with self.subTest(s=s):
                self.assertEqual(has_ligma(s), expected)

if __name__ == "__main__":
    unittest.main()
