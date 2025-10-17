"""Execute user-submitted code against challenge test suites."""

from __future__ import annotations

import shutil
import subprocess
import sys
import tempfile
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Optional

from .challenge_loader import ChallengeLoader, ChallengeMetadata, loader as default_loader


class ExecutionError(RuntimeError):
    """Raised when the executor cannot run tests for a challenge."""


@dataclass(frozen=True)
class ExecutionResult:
    """Structured data about a test execution run."""

    status: str
    exit_code: int
    stdout: str
    stderr: str
    duration: float

    def serialize(self) -> Dict[str, object]:
        return {
            "status": self.status,
            "exit_code": self.exit_code,
            "stdout": self.stdout,
            "stderr": self.stderr,
            "duration": self.duration,
        }


class CodeExecutor:
    """Dispatches execution to language-specific runners."""

    def __init__(self, loader: ChallengeLoader | None = None) -> None:
        self._loader = loader or default_loader

    def execute(
        self,
        language: str,
        unit: str,
        code: str,
        *,
        timeout_seconds: int = 15,
    ) -> ExecutionResult:
        """Execute the provided code against the unit tests."""
        metadata = self._loader.get_challenge(language, unit)
        if language == "python":
            return self._execute_python(metadata, code, timeout_seconds=timeout_seconds)
        raise ExecutionError(f"No executor implemented for language '{language}'")

    def _execute_python(
        self,
        metadata: ChallengeMetadata,
        code: str,
        *,
        timeout_seconds: int,
    ) -> ExecutionResult:
        unit_dir = metadata.solution_path.parent
        with tempfile.TemporaryDirectory(prefix="kumite-python-") as temp_dir:
            temp_path = Path(temp_dir)
            self._copy_challenge_files(unit_dir, temp_path)
            target_solution = temp_path / metadata.solution_path.name
            target_solution.write_text(code, encoding="utf-8")

            # Codewars-style Python challenges expect user code to live in `app.py`.
            # Ensure that the submitted solution is also available under that name
            # so tests importing `app` resolve to the student's code regardless of
            # the starter filename stored on disk.
            app_module = temp_path / "app.py"
            app_module.write_text(code, encoding="utf-8")

            command = [
                sys.executable,
                "-m",
                "pytest",
                "-q",
                metadata.test_path.name,
            ]

            start = time.perf_counter()
            try:
                completed = subprocess.run(
                    command,
                    cwd=temp_path,
                    capture_output=True,
                    text=True,
                    timeout=timeout_seconds,
                )
            except subprocess.TimeoutExpired as exc:  # pragma: no cover - runtime guard
                duration = time.perf_counter() - start
                stdout = exc.stdout or ""
                stderr = exc.stderr or ""
                stderr += "\nExecution timed out."
                return ExecutionResult(
                    status="timeout",
                    exit_code=-1,
                    stdout=stdout,
                    stderr=stderr.strip(),
                    duration=duration,
                )

            duration = time.perf_counter() - start
            status = "passed" if completed.returncode == 0 else "failed"
            return ExecutionResult(
                status=status,
                exit_code=completed.returncode,
                stdout=completed.stdout,
                stderr=completed.stderr,
                duration=duration,
            )

    @staticmethod
    def _copy_challenge_files(source: Path, destination: Path) -> None:
        for entry in source.iterdir():
            target = destination / entry.name
            if entry.is_dir():
                shutil.copytree(entry, target)
            else:
                shutil.copy2(entry, target)


executor = CodeExecutor()

__all__ = ["CodeExecutor", "ExecutionError", "ExecutionResult", "executor"]
