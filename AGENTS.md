# Cove — AI 编码代理指南

> 本文档面向 AI 编码代理。假设读者对项目一无所知，所有信息均基于实际代码与配置文件提取，不做主观推测。

---

## 1. 项目概述

Cove 是一个 **Docker/Podman 镜像拉取与导出管理工具**，提供 Web UI 来：

- 批量管理镜像拉取任务（支持多平台架构）
- 自动/手动导出镜像为 `tar` 归档
- 管理本地已拉取的镜像（浏览、删除、导出）
- 配置多仓库认证（Docker Hub、GHCR、Quay、ACR、ECR、GAR、Harbor、腾讯云、华为云等）
- 通过 Webhook（钉钉、飞书、企业微信、Slack、Discord、Telegram 等）发送通知
- 支持国际化（中/英文）与主题切换
- 内置文档系统（PrismJS 代码高亮）

项目采用 **前后端分离、单容器部署** 架构：前端为 React SPA，后端为 Go HTTP API，生产环境由 Go 服务一并托管前端静态资源。

---

## 2. 技术栈

### 前端
| 技术 | 版本 | 说明 |
|------|------|------|
| React | 18.2 | UI 框架 |
| TypeScript | 5.3 | 类型系统 |
| Vite | 5.1 | 构建工具与开发服务器 |
| React Router DOM | 6.22 | 前端路由 |
| Axios | 1.6.7 | HTTP 客户端 |
| Lucide React | 0.323.0 | 图标库 |
| PrismJS | 1.30.0 | 代码高亮（文档页） |
| Font Awesome | 6.5.1 | 图标（npm 依赖） |

### 后端
| 技术 | 版本 | 说明 |
|------|------|------|
| Go | 1.23 | 运行时 |
| Gin | 1.9.1 | Web 框架 |
| SQLite (modernc.org/sqlite) | 1.29.1 | 嵌入式数据库（纯 Go 驱动） |
| Docker SDK | 20.10.24 | 容器运行时交互 |
| JWT (golang-jwt/jwt/v5) | 5.2.0 | 身份认证 |
| Cron (robfig/cron/v3) | 3.0.1 | 定时任务（每分钟轮询待拉取镜像） |
| bcrypt (golang.org/x/crypto) | 0.31.0 | 密码哈希 |

### 部署与运维
- **Docker** 多阶段构建（Node 构建前端 → Go 编译后端 → Alpine 运行）
- **GitHub Actions** 自动构建并推送多架构镜像（`linux/amd64`, `linux/arm64`）到 `ghcr.io`
- **Docker Compose** 一键启动，挂载 Docker Socket、数据目录与导出目录

---

## 3. 项目结构

```
Cove/
├── src/                          # 前端源码 (React + TypeScript)
│   ├── api/                      # Axios API 封装与端点定义
│   ├── components/               # 通用 UI 组件
│   ├── constants/                # 静态常量（设置、日志、文档翻译）
│   ├── context/                  # React Context（Auth、Theme、Language、Config、Toast、Notification 等）
│   ├── docs/                     # 内置文档系统（组件 + 页面）
│   ├── hooks/                    # 自定义 Hooks
│   ├── pages/                    # 页面级组件
│   │   └── settings/             # 设置子页面（账号、导出、Token、Webhook）
│   ├── types/                    # TypeScript 类型定义
│   ├── utils/                    # 工具函数
│   ├── App.tsx                   # 根组件（路由与布局）
│   └── main.tsx                  # 应用入口
├── app/                          # 后端源码 (Go)
│   ├── cmd/server/main.go        # 服务入口：初始化、路由、启动
│   ├── internal/
│   │   ├── config/               # 配置管理（数据库路径、运行时切换）
│   │   ├── database/             # SQLite 初始化、表结构、迁移、CRUD
│   │   ├── docker/               # Docker/Podman 客户端封装、拉取/导出/平台检测
│   │   ├── handler/              # HTTP Handler（按领域拆分）
│   │   ├── middleware/           # JWT 认证、请求日志
│   │   ├── models/               # 数据模型与请求/响应结构体
│   │   └── service/              # 业务逻辑（ImageService、WebhookService）
│   ├── go.mod / go.sum           # Go 依赖
│   └── startup.sh                # 后端开发启动脚本（自动编译、端口检查）
├── dist/                         # 前端构建输出（生产环境由 Go 托管；已提交到仓库）
├── public/                       # 静态公共资源（图标、字体、Logo、演示图）
├── Dockerfile                    # 多阶段构建定义
├── docker-compose.yml            # 生产部署配置
├── startup.sh                    # 前端开发启动脚本（根目录）
├── vite.config.ts                # Vite 配置（含代理 /api → localhost:9238）
├── tsconfig.json                 # TypeScript 配置
└── package.json                  # Node 依赖与脚本
```

---

## 4. 构建与运行命令

### 环境要求
- Docker 20.10+
- Go 1.23+（开发）
- Node.js 18+（前端开发）

### 生产部署（推荐）
```bash
docker compose up -d --build
# 默认暴露 http://localhost:19238（宿主机 19238 映射容器 9238）
```

### 开发模式
```bash
# 终端 1：启动后端（端口 9238）
cd app && ./startup.sh

# 终端 2：启动前端（端口 8212，根目录脚本）
./startup.sh
# 或直接
npm run dev -- --port 8212
```

> 前端 Vite 配置已将 `/api` 代理到 `http://localhost:9238`，开发时无需处理跨域。

### 手动构建
```bash
# 前端生产构建
npm run build          # 输出到 dist/

# 后端编译（优化二进制）
cd app
go build -ldflags="-s -w" -o server_optimized cmd/server/main.go
```

---

## 5. 运行时架构

### 启动流程（`app/cmd/server/main.go`）
1. 解析命令行参数（支持 `--reset-password <username>` 重置密码为 `123456`）
2. 创建数据目录 (`data/`)
3. 初始化 SQLite 数据库（含表创建与列迁移）
4. 从数据库加载配置并构建 `Config` 对象
5. 创建导出目录 (`exports/`)，规范化相对路径
6. **自动检测容器运行时**：Docker → Podman 自适应切换，不可用则回退并更新数据库
7. 初始化默认用户（`admin / 123456`）
8. 初始化服务（`DockerService`、`WebhookService`、`ImageService`）
9. 启动 Cron 定时任务（每分钟执行 `ProcessPendingImages`）
10. 注册 Gin 路由与中间件
11. 若存在 `dist/` 目录，托管前端静态资源并启用 SPA fallback

### 核心服务关系
```
main.go
  ├── config.Config        ← 数据库路径硬编码，其余从 settings 表读取
  ├── database/sql.DB      ← SQLite (WAL 模式)
  ├── docker.DockerService ← 懒加载 Docker/Podman 客户端
  ├── service.ImageService ← 业务编排（拉取、导出、重试、Webhook 通知）
  ├── service.WebhookService ← 多平台 Webhook 推送
  └── handler.Handler      ← HTTP 接口聚合
```

### 路由与 API 设计
所有业务接口以 `/api` 为前缀，使用 **RESTful 风格**：

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 登录（公开） |
| GET  | `/api/auth/me` | 当前用户 |
| POST | `/api/auth/change-password` | 修改密码 |
| GET  | `/api/images` | 镜像任务列表 |
| POST | `/api/images` | 创建镜像任务 |
| PUT  | `/api/images/:id` | 更新任务 |
| DELETE | `/api/images/:id` | 删除任务 |
| POST | `/api/images/:id/pull` | 手动触发拉取 |
| POST | `/api/images/:id/export` | 手动触发导出 |
| GET  | `/api/images/:id/logs` | 任务日志 |
| GET  | `/api/images/check-platforms` | 检测镜像支持的平台 |
| GET  | `/api/images/check-auth` | 检查仓库认证配置 |
| GET  | `/api/local-images` | 本地镜像列表 |
| DELETE | `/api/local-images/:id` | 删除本地镜像 |
| POST | `/api/local-images/:id/export` | 导出本地镜像 |
| GET  | `/api/operations/status` | 获取操作状态 |
| GET/PUT | `/api/config` | 获取/更新配置 |
| GET  | `/api/config/detect-runtime` | 检测容器运行时 |
| GET  | `/api/browse` | 目录浏览（用于选择导出路径） |
| POST | `/api/webhook/test` | 测试 Webhook |
| POST | `/api/tokens/test` | 测试仓库认证 |
| GET  | `/api/stats` | 统计信息（也作为健康检查端点） |

除 `/api/auth/login` 外，其余业务接口均需 `Authorization: Bearer <JWT>`。

> 注：存在一个调试端点 `GET /debug/user/:username`，用于查看用户密码哈希，生产环境应注意其暴露风险。

---

## 6. 数据库

使用 **SQLite**（`modernc.org/sqlite` 纯 Go 驱动），数据库文件固定位于：
```
<working_dir>/data/app.db
```

### 主要表
- `users` — 用户（默认 `admin`，bcrypt 密码）
- `images` — 镜像任务（状态：`pending` / `pulling` / `success` / `failed`）
- `image_logs` — 操作日志（外键级联删除）
- `settings` — 全局配置（单条记录，`id = 1`，含导出路径、重试策略、Webhook、各仓库 Token、容器运行时）

### 连接参数与优化
```
?_pragma=busy_timeout(5000)
&_pragma=journal_mode(WAL)
&_pragma=synchronous(NORMAL)
```
最大连接数：`10`；最大空闲连接：`5`。

### 迁移策略
启动时通过 `migrateDatabase()` 检查 `settings` 表列是否存在，**动态 `ALTER TABLE ADD COLUMN`** 实现无破坏性升级。当前 `settings` 表包含 25 个以上列（含各仓库的用户名、Token、密码、运行时选择、验证状态等）。

---

## 7. 认证与安全

### JWT 认证
- 签名算法：`HS256`
- 有效期：24 小时
- 密钥：当前硬编码为 `cove-secret-key-change-in-production`
- Token 存储：前端 `localStorage`（`cove_token`）

### 会话管理
- 前端 `AuthContext` 维护登录态，同时检测 **2 小时无操作自动登出**（`SESSION_TIMEOUT = 2 * 60 * 60 * 1000`）
- 401 响应时自动清除 Token 并重定向到登录页

### 默认凭证
- 用户名：`admin`
- 密码：`123456`
- 首次启动自动创建，支持命令行重置：`./server --reset-password admin`

### 密码存储
使用 `golang.org/x/crypto/bcrypt` 哈希存储，禁止明文保存或日志输出。

---

## 8. 容器运行时支持

后端同时支持 **Docker** 与 **Podman**：

- 启动时调用 `docker.DetectRuntime()` 检测可用运行时
- 若当前配置运行时不可用而另一可用，**自动切换并回写数据库**
- Windows 下 Podman 通过 `npipe:////./pipe/podman-machine-default` 连接
- Linux 下检测常见 Unix Socket 路径
- 可通过 `DOCKER_HOST` / `CONTAINER_HOST` 环境变量强制指定宿主机

---

## 9. 代码组织规范

### 文件大小限制
- **单文件不超过 400 行**。接近 300 行时应主动拆分。
- 当前部分历史文件（如 `token_handler.go` 628 行、`TokenSettings.tsx` 649 行）已超出此限制，后续修改应逐步拆解，勿继续膨胀。

### 前端（TypeScript/React）
- 组件：`PascalCase`（如 `ImageModal.tsx`）
- 工具/常量：`camelCase`（如 `imageUtils.ts`、`settings.ts`）
- 按职责拆分到：
  - `src/components/` — 通用组件
  - `src/pages/<page>/` — 页面子组件
  - `src/hooks/` — 自定义 Hooks
  - `src/context/` — Context Provider
  - `src/api/` — API 封装
  - `src/types/` — 类型定义
  - `src/utils/` — 工具函数
  - `src/constants/` — 静态常量

### 后端（Go）
- 文件：`snake_case`（如 `image_handler.go`）
- Handler 按领域拆分（`image_handler.go`、`config_handler.go`、`browse_handler.go` 等）
- 数据库操作按实体拆分（`image_db.go`、`settings_db.go`、`log_db.go`）
- 业务逻辑集中在 `service/` 层

---

## 10. 测试策略

**当前状态：项目未包含自动化测试套件。**

经实际扫描，项目中不存在任何 `*_test.go`、`*.test.ts`、`*.test.tsx` 或 `*.spec.ts` 文件。

建议后续补充的测试层级：

1. **Go 单元测试** — 针对 `service/` 与 `database/` 的核心函数编写表驱动测试
2. **Handler 集成测试** — 使用 `gin` 的 `httptest` 与内存 SQLite 测试 HTTP 接口
3. **前端组件测试** — 使用 Vitest / React Testing Library 测试关键交互组件
4. **E2E 测试** — 使用 Playwright 覆盖登录 → 创建镜像 → 导出完整链路

运行命令（待补充）：
```bash
# Go 测试
cd app && go test ./...

# 前端测试（待配置）
npm test
```

---

## 11. 部署与 CI/CD

### GitHub Actions（`.github/workflows/docker.yml`）
- 触发条件：`main` 分支推送（仅当 Dockerfile、docker-compose.yml、app/、src/、package.json 变更时）、每月定时构建、手动触发
- 构建平台：`linux/amd64`, `linux/arm64`
- 推送目标：`ghcr.io/${{ github.repository_owner }}/cove:latest`

### Docker Compose 关键挂载
```yaml
volumes:
  - /var/run/docker.sock:/var/run/docker.sock   # 必须，用于容器操作
  - ./data:/app/data                             # 持久化数据库
  - ./exports:/app/exports                       # 持久化导出文件
```

### 环境变量
| 变量 | 默认值 | 说明 |
|------|--------|------|
| `SERVER_HOST` | `127.0.0.1` | 服务监听地址（Docker 内建议 `0.0.0.0`） |
| `PORT` / `SERVER_PORT` | `9238` | 服务端口 |
| `DOCKER_HOST` | — | Docker Socket 路径 |
| `CONTAINER_HOST` | — | 强制指定容器运行时主机 |

### 健康检查
Docker Compose 已配置：
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:9238/api/stats"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 10s
```

---

## 12. 代码风格指南

### Go
- 使用标准 `gofmt` 格式化
- 错误处理：显式检查 `err != nil`，禁止吞掉错误
- 日志输出：使用带 ANSI 颜色码的格式（参考 `main.go` 中的 `\033[36m` 等）
- 数据库查询使用参数化语句，禁止字符串拼接 SQL
- 包内私有函数/变量使用小写开头，导出使用大写开头

### TypeScript / React
- 使用函数组件 + Hooks，无类组件
- 严格模式：`strict: true`，`noUnusedLocals: true`，`noUnusedParameters: true`
- 类型定义集中放在 `src/types/`，组件 Props 优先内联或就近定义
- CSS 使用常规 `.css` 文件（无 CSS-in-JS 或 Tailwind），样式文件与组件同级或放在 `src/App.css`、`src/index.css`
- 图标优先使用 `lucide-react`，Font Awesome 作为补充

### 通用
- 注释使用中文（与现有代码保持一致）
- 字符串优先使用单引号
- 缩进：2 个空格（前端），Tab（Go 后端由 `gofmt` 决定）

---

## 13. 安全注意事项

- **JWT 密钥硬编码**：当前密钥 `cove-secret-key-change-in-production` 为硬编码，生产部署应通过环境变量注入
- **调试端点**：`GET /debug/user/:username` 会返回密码哈希，生产环境应考虑移除或限制访问
- **CORS**：后端允许 `*` 跨域，生产环境应根据实际域名收紧
- **默认密码**：首次启动创建的 `admin / 123456` 应在首次登录后立即修改
- **Token 存储**：前端使用 `localStorage` 存储 JWT，存在 XSS 泄露风险
- **敏感信息**：仓库 Token、Webhook URL 等存储在 SQLite `settings` 表中，数据库文件需限制文件系统权限
- **命令注入**：后端与 Docker/Podman 交互时，镜像名称等输入应做校验，禁止直接拼接命令

---

## 14. 开发注意事项

### 修改前端后的生效方式
- 开发模式：Vite HMR 自动刷新
- 生产模式：必须重新执行 `npm run build`，因为 Go 服务托管的是 `dist/` 目录

### 修改 Go 后的生效方式
- 开发模式：`app/startup.sh` 会自动检测源码变更并重新编译 `server_optimized`
- 或直接 `cd app && go build -o server_optimized cmd/server/main.go && ./server_optimized`

### 数据库变更
- 新增 `settings` 列时，应在 `database.go` 的 `migrateDatabase()` 中追加列定义，确保旧数据兼容
- 禁止修改 `images`、`image_logs` 等已有列的类型或删除列，除非同步写迁移脚本

### 国际化
- 前端使用 `useLanguage()` Context，翻译键集中管理
- UI 文本同时维护中文与英文，修改时需同步更新两种语言

### Webhook 新增类型
- 后端：`service/image.go` 中 `WebhookService.SendNotification()` 的 `switch` 分支
- 前端：`src/pages/settings/WebhookSettings.tsx` 的下拉选项与文档说明

---

## 15. 质量检查清单

提交代码前，请确认：

- [ ] 没有文件超过 400 行
- [ ] 每个文件职责单一
- [ ] 导入最小化，无未使用依赖
- [ ] 导出清晰，关键函数/组件有注释说明
- [ ] 无跨文件代码重复
- [ ] 若涉及数据库 schema 变更，已补充迁移逻辑
- [ ] 前端 API 调用与后端路由保持一致
- [ ] 敏感信息（Token、密码）未硬编码到源码或日志
