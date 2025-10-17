"""FastAPI application entrypoint for the Kumite backend."""

from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .challenge_loader import ChallengeNotFoundError, loader as challenge_loader
from .code_executor import ExecutionError, executor as code_executor


class CodeSubmission(BaseModel):
    code: str


app = FastAPI(title="Kumite Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/challenges")
async def list_challenges() -> list[dict[str, object]]:
    return challenge_loader.list_challenges()


@app.get("/challenges/{language}/{unit}")
async def get_challenge(language: str, unit: str) -> dict[str, object]:
    try:
        metadata = challenge_loader.get_challenge(language, unit)
    except ChallengeNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    return metadata.serialize()


@app.post("/execute/{language}/{unit}")
async def execute_challenge(
    language: str,
    unit: str,
    submission: CodeSubmission,
) -> dict[str, object]:
    try:
        result = code_executor.execute(language, unit, submission.code)
    except ChallengeNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except ExecutionError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    return {
        "language": language,
        "unit": unit,
        **result.serialize(),
    }

