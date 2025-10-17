"""Utilities for discovering coding challenges on disk."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Tuple


class ChallengeNotFoundError(FileNotFoundError):
    """Raised when the requested challenge does not exist."""


@dataclass(frozen=True)
class ChallengeMetadata:
    """Immutable metadata for a single challenge unit."""

    language: str
    unit: str
    title: str
    readme: str
    solution_path: Path
    test_path: Path

    def serialize(self) -> Dict[str, str]:
        """Return a JSON-serializable representation of the metadata."""
        return {
            "language": self.language,
            "unit": self.unit,
            "title": self.title,
            "instructions": self.readme,
            "starter_code": self.solution_path.read_text(encoding="utf-8"),
            "test_filename": self.test_path.name,
        }


class ChallengeLoader:
    """Loads and caches challenge metadata from the filesystem."""

    _DEFAULT_FILENAMES: Dict[str, Tuple[str, str]] = {
        "python": ("solution.py", "test.py"),
        "javascript": ("solution.js", "test.js"),
    }

    def __init__(self, challenges_root: Path | None = None) -> None:
        backend_dir = Path(__file__).resolve().parent
        self._root = (
            challenges_root
            if challenges_root is not None
            else backend_dir.parent / "challenges"
        )
        if not self._root.exists():
            raise FileNotFoundError(f"Challenges directory not found: {self._root}")
        self._cache: Dict[Tuple[str, str], ChallengeMetadata] = {}

    def list_challenges(self) -> List[Dict[str, object]]:
        """Return a summary of all available challenges grouped by language."""
        summary: List[Dict[str, object]] = []
        for language_dir in sorted(self._iter_language_dirs()):
            units = [
                {
                    "unit": unit_dir.name,
                    "title": self._determine_title(unit_dir),
                }
                for unit_dir in sorted(self._iter_unit_dirs(language_dir))
            ]
            summary.append({"language": language_dir.name, "units": units})
        return summary

    def get_challenge(self, language: str, unit: str) -> ChallengeMetadata:
        """Return the metadata for a specific challenge."""

        key = (language, unit)
        if key not in self._cache:
            self._cache[key] = self._load_challenge(language, unit)
        return self._cache[key]

    def _load_challenge(self, language: str, unit: str) -> ChallengeMetadata:
        language_dir = self._root / language
        if not language_dir.is_dir():
            raise ChallengeNotFoundError(f"Language '{language}' not found")

        unit_dir = language_dir / unit
        if not unit_dir.is_dir():
            raise ChallengeNotFoundError(
                f"Unit '{unit}' not found for language '{language}'"
            )

        solution_filename, test_filename = self._default_filenames_for(language)
        solution_path = unit_dir / solution_filename
        test_path = unit_dir / test_filename

        if not solution_path.exists():
            raise ChallengeNotFoundError(
                f"Expected solution file missing: {solution_path}"
            )

        if not test_path.exists():
            raise ChallengeNotFoundError(f"Expected test file missing: {test_path}")

        readme_path = unit_dir / "README.md"
        readme_contents = (
            readme_path.read_text(encoding="utf-8") if readme_path.exists() else ""
        )

        title = self._extract_title(readme_contents, unit_dir.name)

        return ChallengeMetadata(
            language=language,
            unit=unit,
            title=title,
            readme=readme_contents,
            solution_path=solution_path,
            test_path=test_path,
        )

    def _iter_language_dirs(self) -> Iterable[Path]:
        return (
            path
            for path in self._root.iterdir()
            if path.is_dir() and not path.name.startswith(".")
        )

    def _iter_unit_dirs(self, language_dir: Path) -> Iterable[Path]:
        return (
            path
            for path in language_dir.iterdir()
            if path.is_dir() and not path.name.startswith(".")
        )

    def _determine_title(self, unit_dir: Path) -> str:
        readme_path = unit_dir / "README.md"
        if not readme_path.exists():
            return unit_dir.name
        return self._extract_title(
            readme_path.read_text(encoding="utf-8"), unit_dir.name
        )

    @staticmethod
    def _extract_title(readme_contents: str, fallback: str) -> str:
        for line in readme_contents.splitlines():
            cleaned = line.strip("# ").strip()
            if cleaned:
                return cleaned
        return fallback

    def _default_filenames_for(self, language: str) -> Tuple[str, str]:
        filenames = self._DEFAULT_FILENAMES.get(language)
        if filenames is not None:
            return filenames
        # Default to conventional names if language is unrecognized.
        return ("solution", "test")


loader = ChallengeLoader()
__all__ = ["ChallengeLoader", "ChallengeMetadata", "ChallengeNotFoundError", "loader"]
