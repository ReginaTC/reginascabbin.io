#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Please run this script with sudo on the server."
  exit 1
fi

SITE_NAME="${SITE_NAME:-personal-hut}"
DOMAIN="${DOMAIN:-_}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/personal-hut}"
CONF_PATH="/etc/nginx/sites-available/${SITE_NAME}"
ENABLED_PATH="/etc/nginx/sites-enabled/${SITE_NAME}"

apt-get update
apt-get install -y nginx

cat > "${CONF_PATH}" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    root ${REMOTE_DIR};
    index index.html;

    location = / {
        try_files /index.html =404;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location / {
        try_files \$uri \$uri/ =404;
    }

    location ~* \\.html$ {
        expires -1;
        add_header Cache-Control "no-cache";
    }

    location ~* \\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff2?)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
    }
}
NGINX

ln -sf "${CONF_PATH}" "${ENABLED_PATH}"
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl enable nginx
systemctl reload nginx

echo "Nginx is configured."
echo "site_name=${SITE_NAME}"
echo "server_name=${DOMAIN}"
echo "root=${REMOTE_DIR}"
