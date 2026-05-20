# Cove

Docker 镜像拉取和导出管理工具。

![Login](public/demo/login.png)


![Home](public/demo/home.png)



## 快速开始

### 环境要求

- Docker 20.10+
- Go 1.21+ (开发环境)
- Node.js 18+ (前端开发)

### Docker 部署（推荐）

```bash
# 构建并启动
docker compose up -d --build

# 访问
http://localhost:9238
```

### Windows + WSL2 + Docker Engine

如果你在 WSL2 Ubuntu 中安装 Docker Engine（非 Docker Desktop），可以通过以下方式连接：

**方式一：在 WSL2 内部运行（推荐）**

直接在 WSL2 终端中执行 `docker compose up -d --build`，此时可通过 Unix socket 直接访问 Docker。

**方式二：在 Windows 宿主机上运行，连接 WSL2 Docker**

1. 在 WSL2 中配置 Docker daemon 监听 TCP：
   ```bash
   sudo nano /etc/docker/daemon.json
   # 添加: {"hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2375"]}
   sudo systemctl restart docker
   ```
2. 在 Web UI 的 **Settings > Export** 中设置 **Docker Host**：
   - `tcp://localhost:2375` — 通过 TCP 连接
   - `npipe:////./pipe/docker_engine` — Windows Docker Desktop 命名管道

或使用环境变量启动：
```bash
set DOCKER_HOST=tcp://localhost:2375
docker compose up -d
```

### 开发模式

```bash
# 启动后端（端口 9238）
cd app && ./startup.sh

# 启动前端（端口 8212）
./startup.sh
```

## 贡献指南

欢迎提交 Issue 和 Pull Request！