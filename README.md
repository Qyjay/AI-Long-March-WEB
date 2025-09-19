# 长征路 - 沉浸式互动历史体验应用

一个基于Vue 3的现代化互动式历史教育应用，通过Mapbox地图导航和沉浸式故事剧情，让用户深度体验中国工农红军长征的伟大历程。

## 🌟 项目特色

- **高精度地图体验**: 基于Mapbox GL JS的真实地理数据长征路线图
- **沉浸式剧情系统**: 丰富的历史故事、人物对话和选择分支
- **智能成就系统**: 完成历史节点解锁相应成就徽章
- **响应式设计**: 完美适配桌面端、平板和移动设备
- **现代化UI**: 基于GSAP的流畅动画效果和优雅视觉设计
- **MCP集成**: 支持Model Context Protocol的智能交互

## 🚀 技术栈

- **前端框架**: Vue 3 + Composition API
- **路由管理**: Vue Router 4
- **状态管理**: Pinia
- **样式框架**: Tailwind CSS + @tailwindcss/forms
- **地图组件**: Mapbox GL JS + @mapbox/mapbox-gl-language
- **动画库**: GSAP
- **构建工具**: Vite 5
- **HTTP客户端**: Axios
- **事件总线**: Mitt
- **开发语言**: JavaScript/ES6+
- **代码规范**: ESLint + Prettier

## 📦 项目结构

```
LongMarch/
├── public/                    # 静态资源目录
│   ├── assets/               # 媒体资源
│   │   ├── achv/            # 成就图标
│   │   ├── broll/           # 背景音乐
│   │   ├── nodes/           # 节点图片
│   │   └── sfx/             # 音效文件
│   └── images/              # 图片资源
│       └── hero-bg.svg      # 首页背景图
├── src/                      # 源代码目录
│   ├── components/          # 可复用组件
│   │   ├── AchievementDisplay.vue  # 成就展示组件
│   │   ├── AchievementToast.vue    # 成就提示组件
│   │   ├── ErrorMessage.vue        # 错误提示组件
│   │   ├── HistoricalDisplay.vue   # 历史展示组件
│   │   ├── LoadingSpinner.vue      # 加载动画组件
│   │   ├── MapView.vue             # 地图组件
│   │   ├── NodeList.vue            # 节点列表组件
│   │   ├── StoryRunner.vue         # 故事播放器
│   │   └── Timeline.vue            # 时间线组件
│   ├── views/               # 页面组件
│   │   ├── Home.vue         # 首页
│   │   ├── MapPage.vue      # 地图页面
│   │   ├── StoryPage.vue    # 故事页面
│   │   ├── Achievements.vue # 成就页面
│   │   ├── Settings.vue     # 设置页面
│   │   └── MapboxTest.vue   # Mapbox测试页面
│   ├── stores/              # Pinia状态管理
│   │   ├── progress.js      # 进度状态
│   │   ├── achievements.js  # 成就状态
│   │   └── settings.js      # 设置状态
│   ├── data/                # 模拟数据
│   │   ├── achievements.mock.json   # 成就数据
│   │   ├── demo-script.mock.json    # 演示脚本
│   │   ├── historical-media.mock.json # 历史媒体
│   │   ├── nodes.mock.json          # 节点数据
│   │   ├── route.mock.json          # 路线数据
│   │   ├── scenes.mock.json         # 场景数据
│   │   └── scenes/                  # 场景文件夹
│   ├── api/                 # API接口层
│   │   ├── index.js         # API入口
│   │   ├── mock.js          # 模拟API
│   │   └── real.js          # 真实API
│   ├── utils/               # 工具函数
│   │   ├── bus.js           # 事件总线
│   │   └── geo.js           # 地理工具
│   ├── router/              # 路由配置
│   │   └── index.js         # 路由定义
│   ├── assets/              # 样式资源
│   │   └── style.css        # 全局样式
│   ├── pages/               # 页面目录(预留)
│   ├── App.vue              # 根组件
│   └── main.js              # 应用入口
├── index.html               # HTML模板
├── mapbox-token-debug.html  # Mapbox调试页面
├── mapbox-token-test.html   # Mapbox测试页面
├── package.json             # 项目配置
├── vite.config.js           # Vite配置
├── tailwind.config.js       # Tailwind配置
├── postcss.config.js        # PostCSS配置
├── .gitignore               # Git忽略文件
└── Frontend_prompt          # 前端提示文件
```

## 🛠️ 安装与运行

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- Mapbox Access Token (用于地图功能)

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动并自动打开浏览器

### 生产环境构建

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### 代码规范

```bash
# 代码检查和修复
npm run lint

# 代码格式化
npm run format
```

### MCP (Model Context Protocol) 相关

```bash
# 启动MCP服务器
npm run mcp:start

# 测试MCP连接
npm run mcp:test

# 查看MCP配置
npm run mcp:config

# 设置Trae MCP
npm run trae:setup

# 测试Trae MCP
npm run trae:test
```

## 🎮 功能介绍

### 核心功能模块

1. **首页导航 (Home.vue)**
   - 项目介绍和功能概览
   - 快速进入地图或查看成就
   - 响应式布局适配各种设备
   - 英雄背景图和动画效果

2. **互动地图 (MapPage.vue + MapView.vue)**
   - 基于Mapbox GL JS的高精度地图
   - 显示完整的长征路线和历史节点
   - 点击节点查看详细信息和历史背景
   - 进度追踪和路线导航
   - 支持缩放、平移和多语言显示
   - 节点列表组件 (NodeList.vue) 提供快速导航

3. **故事剧情系统 (StoryPage.vue + StoryRunner.vue)**
   - 沉浸式历史故事体验
   - 角色对话和选择分支
   - 背景音乐和音效支持
   - 自动保存进度功能
   - 历史展示组件 (HistoricalDisplay.vue)
   - 时间线组件 (Timeline.vue) 展示历史进程

4. **成就系统 (Achievements.vue)**
   - 完成节点解锁成就徽章
   - 成就展示组件 (AchievementDisplay.vue)
   - 成就提示组件 (AchievementToast.vue)
   - 进度统计和分类浏览
   - 成就解锁动画效果

5. **设置中心 (Settings.vue)**
   - 音效和音乐控制
   - 显示偏好设置
   - 数据管理功能
   - 用户体验个性化配置

6. **开发工具**
   - Mapbox测试页面 (MapboxTest.vue)
   - Token调试功能
   - MCP协议集成测试

### 技术特性

- **现代化架构**: Vue 3 Composition API + Vite 5构建
- **响应式设计**: Tailwind CSS自定义断点和动画
- **状态管理**: Pinia模块化状态管理 (progress.js, achievements.js, settings.js)
- **错误处理**: 全局错误捕获和用户友好的错误提示 (ErrorMessage.vue)
- **加载状态**: 统一的加载指示器 (LoadingSpinner.vue) 和Suspense支持
- **性能优化**: 
  - Vite代码分割 (vendor, mapbox, animation chunks)
  - 组件懒加载和路由级别的代码分割
  - 资源优化和缓存策略
- **移动端适配**: 触摸友好的交互体验和自适应布局
- **开发体验**: ESLint + Prettier代码规范，热重载开发服务器

## 🎨 设计理念

- **历史教育**: 通过沉浸式互动体验传承红色文化和长征精神
- **用户体验**: 直观易用的界面设计，流畅的动画交互
- **技术创新**: 现代Web技术的最佳实践，前沿技术栈应用
- **跨平台**: 一次开发，多端适配，响应式设计
- **性能优先**: 优化加载速度，提升用户体验
- **可维护性**: 模块化架构，清晰的代码组织

## 📱 浏览器支持

- **Chrome** >= 90 (推荐)
- **Firefox** >= 88
- **Safari** >= 14
- **Edge** >= 90
- **移动端**: iOS Safari >= 14, Android Chrome >= 90

> 注意：由于使用了Mapbox GL JS，需要支持WebGL的现代浏览器

## 🤝 贡献指南

### 开发流程

1. **Fork 本仓库**
2. **创建特性分支**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **安装依赖并开发**
   ```bash
   npm install
   npm run dev
   ```
4. **代码规范检查**
   ```bash
   npm run lint
   npm run format
   ```
5. **提交更改**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
6. **推送到分支**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **开启 Pull Request**

### 代码规范

- 遵循 ESLint 和 Prettier 配置
- 使用语义化的 commit 信息
- 为新功能添加适当的注释
- 确保代码通过所有检查

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情


**让我们一起重走长征路，感受那段波澜壮阔的历史，传承不朽的长征精神！** 🚩✨

*"雄关漫道真如铁，而今迈步从头越"* - 通过现代科技重现历史，让长征精神薪火相传。