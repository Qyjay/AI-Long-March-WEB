# 重走长征路 · 前端应用（Vue 3 + Vite）

一个以“重走长征路”为主题的沉浸式互动前端应用。基于 Vue 3、Vite、Pinia、Vue Router、Tailwind CSS 构建，集成 GSAP 动效与高德地图 JSAPI，实现地图游历、故事互动与成就收集等体验。

## 技术栈
- 框架：Vue 3 (`vue@^3.4.0`)
- 路由：Vue Router (`vue-router@^4.2.5`)
- 状态管理：Pinia (`pinia@^2.1.7`)
- 构建工具：Vite 5 (`vite@^5.0.8`)
- 样式：Tailwind CSS 3 (`tailwindcss@^3.3.6`)、PostCSS、Autoprefixer
- 动效：GSAP (`gsap@^3.12.2`)
- 地图：高德地图 JSAPI (`@amap/amap-jsapi-loader@^1.0.1`)
- 其他：Axios、Mitt（事件总线）、Prettier、ESLint（Vue 3 推荐规则）

## 环境要求
- Node.js ≥ 18（Vite 5 需要）
- npm ≥ 9 或兼容的包管理器（pnpm/yarn 亦可）

## 快速开始
1. 安装依赖
   ```bash
   npm install
   ```
2. 启动开发服务器（默认 `http://localhost:3000` 并自动打开浏览器）
   ```bash
   npm run dev
   ```
3. 生产构建与本地预览
   ```bash
   npm run build
   npm run preview
   ```

## 常用脚本
- `npm run dev`：本地开发（Vite 开发服务器）
- `npm run build`：生产构建（输出到 `dist/`）
- `npm run preview`：本地预览构建产物
- `npm run lint`：ESLint 校验并自动修复
- `npm run format`：Prettier 格式化 `src/` 目录代码

## 环境变量与模式切换
应用通过环境变量控制 Mock/真实接口模式与地图密钥等配置：
请注意在项目中添加一个.env文件，内容如下：

```env
# 应用标题（路由处用于拼接页面标题）
VITE_APP_TITLE=重走长征路

# 是否使用 Mock 数据：1 或 true 使用本地 JSON；0 使用后端接口
VITE_USE_MOCK=1

# 后端 API 基地址（真实模式下生效）
VITE_API_BASE_URL=http://localhost:8000

# 高德地图 JSAPI 配置（真实地图功能需要）
VITE_AMAP_KEY=你的高德Key
VITE_AMAP_SECURITY_CODE=你的安全码
```

- Mock 切换：`src/api/index.js` 通过 `VITE_USE_MOCK` 自动选择 `mockApi` / `realApi`（参见 `src/api/index.js:10`）。
- 离线提示：`App.vue` 中基于 `VITE_USE_MOCK` 的计算属性显示“离线模式”提示（参见 `src/App.vue:148` 附近）。
- 地图密钥：`MapView.vue` 在初始化时读取 `VITE_AMAP_KEY` 与 `VITE_AMAP_SECURITY_CODE`（参见 `src/components/MapView.vue:165-201`）。

建议在开发环境使用 `.env.local` 存放密钥，避免提交到版本库。

## 目录结构
```
front-end/
├─ public/
├─ src/
│  ├─ api/                # API 客户端（Mock/真实实现）
│  ├─ assets/             # 全局样式等
│  ├─ components/         # 复用组件（地图、时间线、弹窗等）
│  ├─ data/               # 本地 Mock 数据 JSON 与图片
│  ├─ router/             # 路由配置
│  ├─ stores/             # Pinia 状态（进度、设置、成就）
│  ├─ utils/              # 工具与事件总线
│  ├─ views/              # 页面（首页/地图/故事/英雄/纪念馆/设置/成就）
│  ├─ App.vue             # 入口组件（全局错误/加载）
│  └─ main.js             # 应用入口，注册 Pinia 与 Router
├─ index.html             # SPA 宿主页
├─ vite.config.js         # Vite 配置（端口 3000，别名 @ -> src）
├─ tailwind.config.js     # Tailwind 配置与主题扩展
├─ postcss.config.js      # PostCSS 插件配置
├─ .eslintrc.cjs          # ESLint 配置（Vue3 推荐）
└─ package.json           # 依赖与脚本
```

## 功能模块概览
- 地图游历（`views/MapPage.vue` + `components/MapView.vue`）
  - 高德地图加载与控件配置、长征主路线绘制、节点标记与交互（参见 `src/components/MapView.vue:160` 起）。
  - 飞行到节点、切换地图样式、显示/隐藏路线等操作。
- 故事互动（`views/StoryPage.vue` + `components/StoryRunner.vue`）
  - 本地故事列表与轮播、故事详情弹窗；键盘交互与自动播放（参见 `src/components/StoryRunner.vue:892` 起）。
- 成就系统（`views/Achievements.vue` + `stores/achievements.js`）
  - 成就列表展示、筛选与详情弹窗；本地解锁记录与统计。
- 进度管理（`stores/progress.js`）
  - 当前节点、访问记录、选择轨迹，本地存储持久化（参见 `src/stores/progress.js:40` 起）。
- 设置中心（`views/Settings.vue` + `stores/settings.js`）
  - 语言切换、演示模式、音效/语音、地图样式与动效速率等（参见 `src/stores/settings.js:35` 起）。
- 事件总线（`utils/bus.js`）
  - 使用 `mitt` 提供全局事件：飞行到节点、打开场景、成就提示、全局 Toast 等（参见 `src/utils/bus.js:12-34`）。

## API 与数据
- 统一客户端：`src/api/index.js` 暴露 `getNodes/getRoute/getScenes/...` 等方法，并支持模式切换。
- Mock 数据：位于 `src/data/*.mock.json`，便于前端自测与演示。
- 真实接口：`src/api/real.js` 使用 `fetch` 封装重试/超时，基地址由 `VITE_API_BASE_URL` 控制。

## 样式与动效
- 全局样式：`src/assets/style.css`，基于 Tailwind 设计，并提供红色主题与常用动效工具类。
- 动效：时间线、节点脉冲、波纹与扫光等视觉效果，兼顾移动端与无障碍偏好（降级 `prefers-reduced-motion`）。

## 路由与页面标题
- 路由定义参见 `src/router/index.js`，包含首页 `/`、地图 `/map`、故事 `/stories`、英雄 `/heroes`、纪念馆 `/memorials`、设置 `/settings`、成就 `/achievements` 等。
- 页面标题由路由 `meta.title` 与 `VITE_APP_TITLE` 拼接设置（参见 `src/router/index.js:109-111`）。

## 构建与部署
- 运行 `npm run build` 生成 `dist/` 产物，可使用 Nginx/静态服务器托管。
- 如启用真实 API，请在部署环境提供正确的 `VITE_API_BASE_URL` 与高德地图密钥。

## 常见问题（FAQ）
- 开发端口占用：默认端口为 3000（`vite.config.js`），修改后需同步文档或环境。
- 地图无法初始化：检查 `.env` 是否配置了 `VITE_AMAP_KEY` 与 `VITE_AMAP_SECURITY_CODE`，以及网络可用性。
- 数据加载失败：Mock 模式下读取本地 JSON；真实模式需后端接口可达且返回格式兼容。
- 页面标题不生效：确认已设置 `VITE_APP_TITLE`，并检查路由 `meta` 字段。

## 代码质量
- ESLint：`npm run lint`（使用 `plugin:vue/vue3-recommended`）
- 格式化：`npm run format`（Prettier）

---
如需扩展新页面或数据类型，可参考现有模块的组织方式（视图 + 组件 + Store + API），并遵循 `@` 别名与统一事件总线的使用约定。