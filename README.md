# LoomLot-01 · 染坊缸染批次与色牢度抽检

聚焦 **染程调度与色牢度抽检**，不是仓库出入库库存系统。

## 技术栈

| 层 | 技术 |
| --- | --- |
| Backend | NestJS + TypeORM + MySQL + JWT + bcryptjs + class-validator |
| Frontend | Svelte 4 + Vite |
| DB | MySQL 8 |
| 部署 | docker-compose + Nginx 反代 `/api` |

## 端口

| 服务 | 端口 |
| --- | --- |
| 前端（经 Nginx） | **3600** |
| 后端 API | **8600** |
| MySQL | **3309** |

## 演示账号

| 用户名 | 密码 | 角色 |
| --- | --- | --- |
| `admin` | `123456` | 管理员 |
| `dyer` | `123456` | 染程操作员 |

应用首次启动会自动 seed（`SEED_ON_START=true`）。密码哈希使用 `bcryptjs`（兼容 bcrypt 校验）。

## 快速启动（Docker）

```bash
cd D:\work\document\bytecode\claudeCodePro\LoomLot\LoomLot-01
docker compose up -d --build
```

浏览器打开：http://localhost:3600

API 直连：http://localhost:8600/api

停止：

```bash
docker compose down
```

## 本地开发

### 1. 仅启动数据库

```bash
docker compose up -d mysql
```

### 2. 后端

```bash
cd backend
npm install
# Windows PowerShell
$env:DB_HOST="127.0.0.1"; $env:DB_PORT="3309"; $env:PORT="8600"; npm run start:dev
```

也可单独执行 seed：

```bash
$env:DB_HOST="127.0.0.1"; $env:DB_PORT="3309"; npm run seed
```

### 3. 前端

```bash
cd frontend
npm install
npm run dev
```

开发态 Vite 已将 `/api` 代理到 `http://127.0.0.1:8600`。

## 业务模块

1. **Auth** — 登录 / JWT / `GET /api/auth/me`
2. **DyeHouse** — 染坊：`name`, `address`, `notes`
3. **Vat** — 染缸：`dyeHouseId`, `vatCode`, `capacityKg`, `status(ready|busy|maintenance)`；同厂 `vatCode` 唯一
4. **DyeLot** — 染批：`vatId`, `lotCode`, `fabricType`, `colorName`, `startAt`, `status(queued|running|rinsing|done|rework)`
5. **FastnessTest** — 色牢度：`dyeLotId`, `testedAt`, `washRating/rubRating/lightRating(1-5)`, `pass`, `notes`
6. **Dashboard** — 染缸数、running 批次数、近 7 日检测数、不合格数

## API 前缀

所有接口位于 `/api`：

- `POST /api/auth/login`
- `GET/POST/PUT/DELETE /api/dye-houses`
- `GET/POST/PUT/DELETE /api/vats`
- `GET/POST/PUT/DELETE /api/dye-lots`
- `GET/POST/PUT/DELETE /api/fastness-tests`
- `GET /api/dashboard`

除登录外均需 `Authorization: Bearer <token>`。

## 目录

```
LoomLot-01/
├── docker-compose.yml
├── nginx/nginx.conf
├── backend/          # NestJS
├── frontend/         # Svelte 4 + Vite
└── README.md
```

## 环境变量（后端）

| 变量 | 默认 |
| --- | --- |
| `PORT` | 8600 |
| `DB_HOST` | 127.0.0.1 |
| `DB_PORT` | 3309 |
| `DB_USER` | loomlot |
| `DB_PASSWORD` | loomlot123 |
| `DB_NAME` | loomlot |
| `JWT_SECRET` | loomlot-jwt-secret-change-me |
| `SEED_ON_START` | true |
