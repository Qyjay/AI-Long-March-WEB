# 重走长征路 · 前端应用（Vue 3 + Vite）

一个以“重走长征路”为主题的沉浸式互动前端应用。基于 Vue 3、Vite、Pinia、Vue Router、Tailwind CSS 构建，集成 GSAP 动效与高德地图 JSAPI，实现长征故事的阐述与可视化展示

## 你将获得
- 地图游历：在可交互地图上选择长征的节点，感受故事，做出选择
- 长征故事：介绍长征的英雄和长征中的故事
- 红色文旅：介绍长征相关的纪念馆与遗址
- 精灵助手：故事/诗词/问答三种对话，支持前端 LLM 调用（Mock）与后端 SSE（真实）

## 技术栈
- `Vue 3`、`Vite 5`、`Pinia`、`Vue Router`
- `Tailwind CSS`、`PostCSS`、`Autoprefixer`
- 动效：`GSAP`
- 地图：`@amap/amap-jsapi-loader`
- 工具：`Axios`、`mitt`、`ESLint`、`Prettier`
- LLM 客户端：`@langchain/openai`（前端 Mock 模式调用langchain.js）

## 环境要求
- `Node.js` ≥ 18
- 包管理器：`npm`/`pnpm`/`yarn`

## 快速开始
- 安装依赖：`npm install`
- 启动开发：`npm run dev`（默认 `http://localhost:3000`）
- 生产构建：`npm run build`
- 本地预览：`npm run preview`

## 配置与环境变量
想要运行该项目，首先要在项目根目录创建 `.env`，示例：

```env
# 应用标题
VITE_APP_TITLE=重走长征路

# Mock 模式：1/true 使用本地数据与前端 LLM；0/false 使用后端接口
VITE_USE_MOCK=1

# 后端 API 基地址（真实模式使用）
VITE_API_BASE_URL=http://localhost:8000

# 高德地图 JSAPI
VITE_AMAP_KEY=你的高德Key
VITE_AMAP_SECURITY_CODE=你的安全码

# LLM（OpenAI 兼容接口，用于调用前端 LLM）
VITE_OPENAI_BASE_URL=你的模型URL(兼容国内的代理网址)
VITE_OPENAI_API_KEY=你的ApiKey
VITE_LLM_MODEL=你的模型名（如gpt-3.5-turbo）
```

重要说明：
- 不要提交密钥，建议使用 `.env.local` 且忽略到版本库。

## 模式说明
- Mock 模式（`VITE_USE_MOCK=1`）：
  - 数据：读取 `src/data/*.mock.json`中的节点数据等
  - 精灵助手：前端直接调用 LLM（流式），每个 Tab 独立提示词与记忆（`src/lib/langchainClient.ts:24-38, 83-125`）
- 真实模式（`VITE_USE_MOCK=0`）：
  - 数据：请求后端 API（`VITE_API_BASE_URL`）
  - 精灵助手：通过后端 SSE 流式返回（`src/components/SpriteAssistant.vue:220-289`）

## 目录结构
```
front-end/
├─ public/
├─ src/
│  ├─ api/                # API 客户端（Mock/真实）
│  ├─ assets/             # 样式与静态资源
│  ├─ components/         # 复用组件（地图、时间线、弹窗等）
│  ├─ data/               # 本地 Mock 数据
│  ├─ lib/                # LLM 客户端等封装
│  ├─ router/             # 路由
│  ├─ stores/             # Pinia 状态
│  ├─ utils/              # 工具与事件总线
│  ├─ views/              # 页面
│  ├─ App.vue             # 入口组件（全局加载/错误）
│  └─ main.js             # 应用入口
└─ 其他配置文件
```

## 主要模块
- 主页面：`views/Home.vue`
- 地图游历：`views/MapPage.vue` + `components/MapView.vue`
- 长征故事：`views/StoryPage.vue` + `components/StoryRunner.vue`
- 长征英雄：`views/HeroPage.vue` + `components/HeroDetailModal.vue`
- 红色文旅：`views/MemorialsPage.vue` + `components/MemorialsDetailModal.vue`
- 成就系统：`views/Achievements.vue` + `stores/achievements.js`（当前版本已在项目中移除，以后可能会重新引入）
- 精灵助手：`components/SpriteAssistant.vue`（Mock 前端流式/真实后端 SSE）

## LLM 集成（前端）
- 封装文件：`src/lib/langchainClient.ts`
- 能力：
  - 三类对话独立系统提示与记忆：`story`/`poem`/`qa`
  - 方法：`ask`（非流式）、`askStream`（流式）
  - 仅使用 `.env` 中的 `baseURL/key/model`，未配置即报错
- 注意：
  - 模型名需真实可用（代理常见：`gpt-3.5-turbo`）；不支持的模型会 400（血的教训）。
  - 代理要求 `baseURL` 带 `/v1`；修改后需重启。

## API 与数据
- 模式切换：统一入口 `src/api/index.js` 根据 `VITE_USE_MOCK` 切换 `mockApi` / `realApi`。
- Mock 数据：`src/data/*.mock.json`，适合演示与自测。
- 真实接口：`src/api/real.js` 使用 `fetch`，基地址 `VITE_API_BASE_URL`。

## 代码规范
- Lint：`npm run lint`（`plugin:vue/vue3-recommended`）
- 格式化：`npm run format`（Prettier）
- 命名与组织：组件、组合式函数、样式、资源遵循统一约定与别名 `@ -> src`

## 构建与部署
- 构建：`npm run build` 生成 `dist/`，可用 Nginx/静态服务器托管
- 生产变量：确保注入 `VITE_API_BASE_URL` 与地图/LLM 密钥

## 常见问题
- `.env` 未生效：重启开发服务器；确保变量以 `VITE_` 开头且无前后空格
- 400（Bad Request）：模型不被代理支持或路径错误（需带 `/v1`）；流式不支持时已自动降级
- 401（Unauthorized）：密钥错误或权限不足；检查代理 Key 与额度
- CORS：若浏览器直连第三方域名受限，使用 Vite 代理或后端转发

---
欢迎按现有模式扩展新页面或数据类型（视图 + 组件 + Store + API），保持统一事件总线与别名的使用习惯。