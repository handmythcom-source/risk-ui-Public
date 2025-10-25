# 部署到免费线上环境（Netlify / Vercel / GitHub Pages）

本文档提供端到端的部署方案，包括平台选择、环境变量配置、自动化部署流程、性能优化与最终公开访问链接的获取方式。

## 一览
- 构建命令：`npm run build`
- 产物目录：`dist`
- 客户端路由：SPA，已为各平台配置回退到 `index.html`
- 环境变量：`VITE_API_BASE`（后端 API 基地址），`VITE_BASE`（GitHub Pages 子路径 base，由工作流自动注入）

## 前置准备
- 安装 Node.js 18+（推荐 20）：`node -v`
- 将项目推送到 GitHub 仓库（默认分支 `main`）：
  ```bash
  git init
  git add .
  git commit -m "chore: init"
  git branch -M main
  # 创建 GitHub 仓库并设置远程（可使用网页或 gh CLI）
  git remote add origin https://github.com/<your-username>/<repo>.git
  git push -u origin main
  ```

---

## 方案 A：Netlify（推荐，轻量稳定）

已添加文件：`netlify.toml` 与 `public/_redirects`，包含构建命令、发布目录、SPA 回退与静态资源缓存。

1) 在 Netlify 导入仓库
- 登录 Netlify → `Add new site` → `Import an existing project`
- 选择 GitHub 仓库

2) 配置构建
- Build command：`npm run build`
- Publish directory：`dist`

3) 环境变量（可选，接入真实后端）
- `VITE_API_BASE`：例如 `https://api.example.com`
  - 若未设置或后端不可用，前端会自动使用内置模拟数据，保证模块可用

4) 部署与访问
- 保存后自动构建，获得公开链接：`https://<your-site>.netlify.app/`

---

## 方案 B：Vercel（推荐，全球加速）

已添加文件：`vercel.json`，包含构建命令、输出目录与 SPA 路由回退。

1) 在 Vercel 导入仓库
- 登录 Vercel → `New Project` → 选择 GitHub 仓库

2) 配置构建
- Framework：`Vite`
- Build Command：`npm run build`
- Output Directory：`dist`

3) 环境变量（可选）
- 添加 `VITE_API_BASE`，例如 `https://api.example.com`

4) 部署与访问
- 保存后自动构建，获得公开链接：`https://<project>.vercel.app/`

> 可选：使用 CLI 非交互部署
> - 设置 `VERCEL_TOKEN`、`VERCEL_ORG_ID`、`VERCEL_PROJECT_ID` 后可 `npx vercel deploy --prod`

---

## 方案 C：GitHub Pages（完全免费、自动化工作流）

已添加工作流：`.github/workflows/deploy.yml`，自动构建并发布到 Pages。

1) 启用 Pages
- 打开仓库 → `Settings` → `Pages` → `Source` 选择 `GitHub Actions`

2) 自动注入子路径 base
- 工作流在构建时注入 `VITE_BASE="/<repo>/"`，并复制 `404.html`，保证刷新与直达子路径正常

3) 部署与访问
- 推送到 `main` 分支后自动构建
- 公共链接：`https://<your-username>.github.io/<repo>/`

> 若使用组织账号：`https://<org>.github.io/<repo>/`

---

## 环境变量与后端/数据库

- `VITE_API_BASE`：后端 API 基地址
  - 生产环境文件：`/.env.production`
  - 例：`VITE_API_BASE=https://api.example.com`
- 当前前端在后端不可达时自动回退到内置模拟数据，确保“风险全景”和其他模块可用
- 若需接入真实数据库：
  - 推荐使用托管后端（如现有服务或 Serverless API 网关），前端通过 `VITE_API_BASE` 调用
  - 若新建后端，可考虑免费 Postgres（如 Supabase）并暴露 REST API；注意 CORS 与鉴权

---

## 自动化部署流程说明

- Netlify/Vercel：连接仓库后，默认触发“每次推送自动构建与部署”，无需额外设置
- GitHub Pages：工作流已配置。推送到 `main` 自动执行：
  - 安装依赖 → 构建 → 注入 `VITE_BASE` → 复制 `404.html` → 发布到 Pages

---

## 性能优化（免费资源限制下）

- 手动分包（已启用）：`react` / `antd` / `echarts` 拆分，降低单包体积
- 长缓存（Netlify 已启用）：`/assets/*` 设置 `immutable`
- 按需加载：将较大的页面/图表按需 `import()`（后续迭代可加）

---

## 验证与问题排查

- 本地生产构建：`npm run build` → `npm run preview`（默认 `http://localhost:4173`）
- 终端无错误：若出现构建警告（大包体积），已通过分包缓解；继续按需拆分可进一步优化
- 前端路由：刷新子路径在各平台均回退到 `index.html`

---

## 最终交付项

- 多平台部署配置已就绪：`netlify.toml`、`public/_redirects`、`vercel.json`、`deploy.yml`
- 环境变量占位：`.env.production`（`VITE_API_BASE`）
- 动态 base 与分包优化：`vite.config.js`
- 公共访问链接：
  - Netlify：`https://<your-site>.netlify.app/`
  - Vercel：`https://<project>.vercel.app/`
  - GitHub Pages：`https://<your-username>.github.io/<repo>/`

如需我代为创建 GitHub 仓库并推送、或使用 Vercel/Netlify CLI 完成一次性部署，请告知账户信息或令牌（推荐通过平台界面操作更简便）。