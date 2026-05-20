#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env.deploy"
DIST_DIR="${ROOT_DIR}/dist"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Missing ${ENV_FILE}. Copy .env.deploy.example to .env.deploy first."
  exit 1
fi

# shellcheck disable=SC1090
source "${ENV_FILE}"

: "${SERVER_HOST:?SERVER_HOST is required}"
: "${SERVER_USER:?SERVER_USER is required}"
: "${SERVER_PORT:=22}"
: "${REMOTE_DIR:=/var/www/personal-hut}"

SSH_OPTS=("-p" "${SERVER_PORT}" "-o" "StrictHostKeyChecking=accept-new")
if [[ -n "${SSH_KEY_PATH:-}" ]]; then
  SSH_OPTS+=("-i" "${SSH_KEY_PATH}")
fi

REMOTE="${SERVER_USER}@${SERVER_HOST}"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required. Please install Node.js (which includes npm) first."
  exit 1
fi

echo "[1/4] Installing dependencies (npm install)..."
(cd "${ROOT_DIR}" && npm install)

echo "[2/4] Building production files (npm run build)..."
(cd "${ROOT_DIR}" && npm run build)

if [[ ! -d "${DIST_DIR}" ]]; then
  echo "Build output not found: ${DIST_DIR}"
  exit 1
fi

echo "[3/4] Checking SSH connection..."
ssh "${SSH_OPTS[@]}" "${REMOTE}" "echo connected"

echo "[4/4] Preparing remote directory ${REMOTE_DIR} and uploading dist/ ..."
ssh -tt "${SSH_OPTS[@]}" "${REMOTE}" "sudo mkdir -p '${REMOTE_DIR}' && sudo chown -R '${SERVER_USER}:${SERVER_USER}' '${REMOTE_DIR}'"

rsync -avz --delete \
  -e "ssh ${SSH_OPTS[*]}" \
  --exclude '.DS_Store' \
  "${DIST_DIR}/" "${REMOTE}:${REMOTE_DIR}/"

echo "Done. Files are synced to ${REMOTE}:${REMOTE_DIR}"
if [[ -n "${DOMAIN:-}" ]]; then
  echo "Remember to point DNS for ${DOMAIN} to this server."
fi
