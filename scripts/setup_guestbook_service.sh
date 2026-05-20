#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Please run this script with sudo on the server."
  exit 1
fi

API_DIR="${API_DIR:-/opt/personal-hut-guestbook}"
RUN_USER="${RUN_USER:-regina}"
PORT="${PORT:-3001}"
DB_DIR="${DB_DIR:-/var/www/personal-hut/data}"
SERVICE_NAME="${SERVICE_NAME:-personal-hut-guestbook}"
SERVICE_PATH="/etc/systemd/system/${SERVICE_NAME}.service"

apt-get update
apt-get install -y nodejs npm

mkdir -p "${DB_DIR}"
chown -R "${RUN_USER}:${RUN_USER}" "${DB_DIR}"

if [[ ! -f "${API_DIR}/package.json" ]]; then
  echo "Missing ${API_DIR}/package.json. Please deploy backend files first."
  exit 1
fi

sudo -u "${RUN_USER}" bash -lc "cd '${API_DIR}' && npm install --omit=dev"

cat > "${SERVICE_PATH}" <<SYSTEMD
[Unit]
Description=Personal Hut Guestbook API
After=network.target

[Service]
Type=simple
User=${RUN_USER}
WorkingDirectory=${API_DIR}
Environment=NODE_ENV=production
Environment=PORT=${PORT}
Environment=DB_DIR=${DB_DIR}
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=2

[Install]
WantedBy=multi-user.target
SYSTEMD

systemctl daemon-reload
systemctl enable --now "${SERVICE_NAME}"
systemctl restart "${SERVICE_NAME}"
systemctl --no-pager --full status "${SERVICE_NAME}"

echo "Guestbook API service is running."
echo "service=${SERVICE_NAME}"
echo "port=${PORT}"
echo "db_dir=${DB_DIR}"
