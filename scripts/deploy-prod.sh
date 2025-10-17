#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

IMAGE_NAME="${IMAGE_NAME:-need4swede/kumite}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
IMAGE_REF="${IMAGE_NAME}:${IMAGE_TAG}"
DOCKERFILE_PATH="${DOCKERFILE_PATH:-${REPO_ROOT}/Dockerfile}"
BUILD_CONTEXT="${BUILD_CONTEXT:-${REPO_ROOT}}"
API_BASE_ARG="${VITE_API_BASE_URL:-/api}"

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker CLI is not installed or not on PATH." >&2
  exit 1
fi

if ! docker buildx version >/dev/null 2>&1; then
  echo "Error: docker buildx is required for multi-arch builds. Please update Docker." >&2
  exit 1
fi

PLATFORMS="${PLATFORMS:-linux/amd64,linux/arm64}"

BUILDER_NAME="${BUILDER_NAME:-kumite_builder}"
if ! docker buildx inspect "${BUILDER_NAME}" >/dev/null 2>&1; then
  echo "Creating buildx builder ${BUILDER_NAME}..."
  docker buildx create --name "${BUILDER_NAME}" --use >/dev/null
else
  docker buildx use "${BUILDER_NAME}" >/dev/null
fi

echo "Bootstrapping builder ${BUILDER_NAME}..."
docker buildx inspect --bootstrap >/dev/null

echo "Building and pushing ${IMAGE_REF} for platforms ${PLATFORMS}..."
docker buildx build \
  --platform "${PLATFORMS}" \
  -f "${DOCKERFILE_PATH}" \
  --build-arg VITE_API_BASE_URL="${API_BASE_ARG}" \
  -t "${IMAGE_REF}" \
  --push \
  "${BUILD_CONTEXT}"

echo "Multi-architecture image pushed successfully."
