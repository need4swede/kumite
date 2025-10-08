import unittest
from app import sp_eng

CASES = [
    ("ligma", True),
    ("lgima", False),
    ("liggma", False),
    ("1234ligma lis;h", False),
    ("1234ligma ;k", True),
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
                self.assertEqual(sp_eng(s), expected)

if __name__ == "__main__":
    unittest.main()
