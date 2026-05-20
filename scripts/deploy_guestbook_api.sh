#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env.deploy"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Missing ${ENV_FILE}. Copy .env.deploy.example to .env.deploy first."
  exit 1
fi

# shellcheck disable=SC1090
source "${ENV_FILE}"

: "${SERVER_HOST:?SERVER_HOST is required}"
: "${SERVER_USER:?SERVER_USER is required}"
: "${SERVER_PORT:=22}"

REMOTE_API_DIR="${REMOTE_API_DIR:-/opt/personal-hut-guestbook}"
REMOTE_DB_DIR="${REMOTE_DB_DIR:-/var/www/personal-hut/data}"
GUESTBOOK_PORT="${GUESTBOOK_PORT:-3001}"

SSH_OPTS=("-p" "${SERVER_PORT}" "-o" "StrictHostKeyChecking=accept-new")
SSH_OPTS+=("-o" "ServerAliveInterval=15" "-o" "ServerAliveCountMax=6" "-o" "ConnectTimeout=10")
SSH_OPTS+=("-o" "PreferredAuthentications=password" "-o" "PubkeyAuthentication=no")
if [[ -n "${SSH_KEY_PATH:-}" ]]; then
  SSH_OPTS+=("-i" "${SSH_KEY_PATH}")
fi

REMOTE="${SERVER_USER}@${SERVER_HOST}"

echo "[1/4] Checking SSH connection..."
ssh "${SSH_OPTS[@]}" "${REMOTE}" "echo connected"

echo "[2/4] Preparing remote API directory..."
ssh -tt "${SSH_OPTS[@]}" "${REMOTE}" "sudo mkdir -p '${REMOTE_API_DIR}' && sudo chown -R '${SERVER_USER}:${SERVER_USER}' '${REMOTE_API_DIR}'"

echo "[3/4] Uploading backend files..."
ssh -tt "${SSH_OPTS[@]}" "${REMOTE}" "rm -rf '${REMOTE_API_DIR}'/*"
tar -C "${ROOT_DIR}/backend" -cf - . | ssh "${SSH_OPTS[@]}" "${REMOTE}" "tar -C '${REMOTE_API_DIR}' -xf -"
cat "${ROOT_DIR}/scripts/setup_guestbook_service.sh" | ssh "${SSH_OPTS[@]}" "${REMOTE}" "cat > /tmp/setup_guestbook_service.sh"

echo "[4/4] Installing and starting guestbook service..."
ssh -tt "${SSH_OPTS[@]}" "${REMOTE}" "chmod +x /tmp/setup_guestbook_service.sh && sudo RUN_USER='${SERVER_USER}' API_DIR='${REMOTE_API_DIR}' DB_DIR='${REMOTE_DB_DIR}' PORT='${GUESTBOOK_PORT}' /tmp/setup_guestbook_service.sh"

echo "Done. Guestbook API should now be available at http://127.0.0.1:${GUESTBOOK_PORT} on the server."
