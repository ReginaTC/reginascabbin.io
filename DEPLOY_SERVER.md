# 部署到你自己的服务器（Ubuntu + Nginx）

这套项目使用 npm + Vite 工作流：本地开发、构建 `dist`、再部署到服务器。流程如下：

1. 本地配置服务器参数
2. npm 安装依赖并构建
3. 把 `dist` 上传到服务器
4. 服务器配置 Nginx
5. 部署暖心寄语 API（Node + SQLite）
6. （可选）开启 HTTPS

## 1) 本地准备

在项目根目录执行：

```bash
cp .env.deploy.example .env.deploy
```

编辑 `.env.deploy`，至少填好这些：

- `SERVER_HOST`: 你的服务器 IP 或域名
- `SERVER_USER`: 登录用户（常见是 `ubuntu` 或 `root`）
- `SSH_KEY_PATH`: 你的私钥路径（例如 `~/.ssh/id_rsa`）
- `REMOTE_DIR`: 网站目录（默认 `/var/www/personal-hut`）
- `DOMAIN`: 你的域名（没有域名可留空）
- `REMOTE_API_DIR`: 留言 API 部署目录（默认 `/opt/personal-hut-guestbook`）
- `REMOTE_DB_DIR`: 留言 SQLite 数据目录（默认 `/var/www/personal-hut/data`）
- `GUESTBOOK_PORT`: 留言 API 端口（默认 `3001`）

## 2) 安装依赖并构建（本地）

```bash
npm install
npm run dev
```

用于日常开发。

如果要本地联调留言功能，需要额外启动留言 API（首次先安装依赖）：

```bash
npm run guestbook:install
npm run guestbook:start
```

前端 `vite` 开发服务会将 `/api/*` 自动代理到 `http://127.0.0.1:3001`。

生产构建命令：

```bash
npm run build
```

## 3) 上传网站文件（自动上传 `dist`）

```bash
chmod +x ./scripts/deploy_site.sh ./scripts/setup_nginx.sh
./scripts/deploy_site.sh
```

这一步会自动执行 `npm install + npm run build`，然后把 `dist/` 同步到服务器 `REMOTE_DIR`。

## 4) 在服务器上配置 Nginx

先把脚本上传到服务器并执行：

```bash
scp -P <端口> -i <私钥> ./scripts/setup_nginx.sh <用户>@<服务器IP>:/tmp/setup_nginx.sh
ssh -p <端口> -i <私钥> <用户>@<服务器IP>
```

登录后执行：

```bash
chmod +x /tmp/setup_nginx.sh
sudo SITE_NAME=personal-hut DOMAIN=<你的域名或_> REMOTE_DIR=<和.env.deploy一致> /tmp/setup_nginx.sh
```

如果暂时只用 IP 访问，`DOMAIN` 传 `_` 即可。

## 5) 部署暖心寄语 API（Node + SQLite）

首次部署或后续更新留言功能，执行：

```bash
chmod +x ./scripts/deploy_guestbook_api.sh ./scripts/setup_guestbook_service.sh
./scripts/deploy_guestbook_api.sh
```

这一步会自动：

- 上传 `backend/` 到服务器
- 在服务器安装 Node/npm（如果未安装）
- 安装 API 依赖
- 创建并启动 `systemd` 服务 `personal-hut-guestbook`

可用以下命令在服务器检查服务：

```bash
sudo systemctl status personal-hut-guestbook
curl -s http://127.0.0.1:3001/health
curl -s http://127.0.0.1:3001/api/messages
```

## 6) （可选）开启 HTTPS（Let's Encrypt）

确保域名已经解析到服务器后，执行：

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d <你的域名>
```

完成后用下面命令检查自动续期：

```bash
sudo certbot renew --dry-run
```

## 常见问题

- 访问 403/404：确认 `REMOTE_DIR` 下有 `index.html`（来自 `dist`），并且 Nginx `root` 与它一致。
- 上传失败：确认安全组开放 `22` 端口，以及本地私钥和用户名正确。
- 无法公网访问：确认云服务器安全组开放 `80`（和 `443`）。
- 留言提交失败：确认 `personal-hut-guestbook` 服务是 `active`，并且 Nginx 配置已包含 `/api/` 反向代理。
