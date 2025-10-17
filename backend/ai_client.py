"""Utilities for interacting with the Ollama API."""

from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache
from typing import Any, Dict, Optional

import httpx


class AIIntegrationError(RuntimeError):
    """Raised when the AI integration cannot fulfil a request."""


@dataclass(frozen=True)
class FailureExplanationContext:
    """Information describing a failed test run."""

    language: str
    unit: str
    challenge_title: str
    challenge_readme: str
    code: str
    stdout: str
    stderr: str
    status: Optional[str] = None
    exit_code: Optional[int] = None


@dataclass(frozen=True)
class OllamaSettings:
    """Configuration for connecting to the Ollama API."""

    api_url: str
    model: str
    fail_prompt: str
    api_key: Optional[str] = None

    @property
    def chat_url(self) -> str:
        return f"{self.api_url.rstrip('/')}/api/chat"


@lru_cache(maxsize=1)
def get_settings() -> OllamaSettings:
    """Load Ollama configuration from environment variables."""
    api_url = os.getenv("OLLAMA_API_URL", "http://localhost:11434").strip()
    model = os.getenv("OLLAMA_API_MODEL", "").strip()
    fail_prompt = os.getenv("OLLAMA_API_FAIL_PROMPT", "").strip()
    api_key = os.getenv("OLLAMA_API_KEY", "").strip() or None

    if not model:
        raise AIIntegrationError(
            "OLLAMA_API_MODEL is not configured. "
            "Set the environment variable to the desired model name."
        )

    if not fail_prompt:
        raise AIIntegrationError(
            "OLLAMA_API_FAIL_PROMPT is not configured. "
            "Provide prompt instructions so the AI knows how to explain failures."
        )

    return OllamaSettings(
        api_url=api_url or "http://localhost:11434",
        model=model,
        fail_prompt=fail_prompt,
        api_key=api_key,
    )


def _truncate(text: str, limit: int = 4000) -> str:
    """Avoid sending unbounded payloads to the AI provider."""
    if len(text) <= limit:
        return text
    ellipsis = "\n\n[truncated]"
    return text[: limit - len(ellipsis)].rstrip() + ellipsis


async def explain_failure(context: FailureExplanationContext) -> str:
    """Return an explanation of a failed test execution."""
    settings = get_settings()

    user_sections = [
        f"Challenge: {context.challenge_title}",
        f"Language: {context.language}",
        f"Unit: {context.unit}",
        "Challenge Instructions:\n"
        f"{_truncate(context.challenge_readme or 'No instructions provided.')}",
        "Submitted Code:\n" + _truncate(context.code),
        "Test Run Details:\n"
        f"Status: {context.status or 'unknown'}\n"
        f"Exit Code: {context.exit_code if context.exit_code is not None else 'n/a'}\n"
        f"stdout:\n{_truncate(context.stdout or 'No stdout captured.')}\n"
        f"stderr:\n{_truncate(context.stderr or 'No stderr captured.')}",
    ]
    user_message = "\n\n".join(user_sections)

    payload: Dict[str, Any] = {
        "model": settings.model,
        "messages": [
            {"role": "system", "content": settings.fail_prompt},
            {"role": "user", "content": user_message},
        ],
        "stream": False,
    }

    headers = {}
    if settings.api_key:
        headers["Authorization"] = f"Bearer {settings.api_key}"

    async with httpx.AsyncClient(timeout=httpx.Timeout(30.0)) as client:
        try:
            response = await client.post(settings.chat_url, json=payload, headers=headers)
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:  # pragma: no cover - network failure
            raise AIIntegrationError(
                f"Ollama API returned an error: {exc.response.status_code}"
            ) from exc
        except httpx.RequestError as exc:  # pragma: no cover - network failure
            raise AIIntegrationError("Unable to contact Ollama API.") from exc

    data = response.json()
    message = data.get("message", {})
    content = message.get("content")
    if not content:
        raise AIIntegrationError("Ollama API did not return any content.")
    return content.strip()


__all__ = [
    "AIIntegrationError",
    "FailureExplanationContext",
    "explain_failure",
]
