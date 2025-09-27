# 长征项目后端API文档

## 概述

长征项目后端API提供了完整的数据服务，支持长征历史节点、路线、场景、用户管理、进度跟踪等功能。

### 基础信息

- **基础URL**: `http://localhost:3000/api`
- **协议**: HTTP/HTTPS
- **数据格式**: JSON
- **认证方式**: JWT Bearer Token
- **超时时间**: 10秒
- **重试机制**: 最多3次重试，间隔1秒

### 通用响应格式

```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 错误响应格式

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 认证相关API

### 用户登录

**POST** `/api/auth/login`

用户登录获取访问令牌。

#### 请求参数

```json
{
  "username": "string", // 用户名
  "password": "string" // 密码
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user123",
      "username": "testuser",
      "email": "test@example.com",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "expiresIn": 86400
  },
  "message": "登录成功"
}
```

### 用户注册

**POST** `/api/auth/register`

注册新用户账户。

#### 请求参数

```json
{
  "username": "string", // 用户名（3-20字符）
  "email": "string", // 邮箱地址
  "password": "string" // 密码（最少8位）
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user124",
      "username": "newuser",
      "email": "new@example.com",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  },
  "message": "注册成功"
}
```

## 节点数据API

### 获取所有节点

**GET** `/api/nodes`

获取所有长征历史节点数据。

#### 查询参数

| 参数  | 类型   | 必填 | 描述               |
| ----- | ------ | ---- | ------------------ |
| page  | number | 否   | 页码，默认1        |
| limit | number | 否   | 每页数量，默认20   |
| sort  | string | 否   | 排序字段，默认time |
| order | string | 否   | 排序方向，asc/desc |

#### 响应示例

```json
{
  "success": true,
  "data": [
    {
      "id": "ruijin",
      "name_zh": "瑞金出发",
      "name_en": "Departure from Ruijin",
      "lng": 116.027,
      "lat": 25.875,
      "time": "1934年10月",
      "time_en": "October 1934",
      "summary_zh": "中央红军从瑞金出发，踏上艰苦卓绝的征途。",
      "summary_en": "The Central Red Army departs from Ruijin...",
      "description_zh": "详细描述...",
      "description_en": "Detailed description...",
      "poem_zh": "雄关漫道真如铁，而今迈步从头越。",
      "poem_en": "The pass is like iron, yet we stride anew...",
      "image": "/assets/nodes/ruijin.webp",
      "gallery": [
        "/assets/gallery/ruijin_1.webp",
        "/assets/gallery/ruijin_2.webp"
      ],
      "assets": {
        "broll": "/assets/broll/ruijin.mp4",
        "sfx": "/assets/sfx/step.mp3",
        "video": "/assets/video/ruijin_documentary.mp4"
      },
      "historical_significance": "瑞金是中华苏维埃共和国临时中央政府所在地...",
      "casualties": "约8.6万人开始长征",
      "weather": "秋季，天气转凉",
      "terrain": "丘陵地带，河流众多"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "pages": 1
  }
}
```

### 获取单个节点

**GET** `/api/nodes/{nodeId}`

根据节点ID获取详细信息。

#### 路径参数

| 参数   | 类型   | 必填 | 描述         |
| ------ | ------ | ---- | ------------ |
| nodeId | string | 是   | 节点唯一标识 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "id": "ruijin",
    "name_zh": "瑞金出发",
    "name_en": "Departure from Ruijin"
    // ... 完整节点信息
  }
}
```

## 路线数据API

### 获取路线数据

**GET** `/api/route`

获取长征路线的GeoJSON数据。

#### 查询参数

| 参数       | 类型    | 必填 | 描述             |
| ---------- | ------- | ---- | ---------------- |
| routeId    | string  | 否   | 指定路线ID       |
| simplified | boolean | 否   | 是否返回简化版本 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "id": "main_route",
          "name": "Long March Main Route",
          "description": "中央红军长征主要路线",
          "distance_km": 12500,
          "duration_days": 368
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [116.027, 25.875],
            [115.2, 26.1]
            // ... 更多坐标点
          ]
        }
      }
    ]
  }
}
```

### 获取节点间路径

**GET** `/api/route/path`

计算两个节点之间的路径。

#### 查询参数

| 参数 | 类型   | 必填 | 描述       |
| ---- | ------ | ---- | ---------- |
| from | string | 是   | 起始节点ID |
| to   | string | 是   | 目标节点ID |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "path": {
      "type": "LineString",
      "coordinates": [
        [116.027, 25.875],
        [115.2, 26.1]
      ]
    },
    "distance": 125.6,
    "duration": 15,
    "nodes": ["ruijin", "xiangjiang"]
  }
}
```

## 场景数据API

### 获取所有场景

**GET** `/api/scenes`

获取所有场景数据或根据节点筛选。

#### 查询参数

| 参数   | 类型   | 必填 | 描述         |
| ------ | ------ | ---- | ------------ |
| nodeId | string | 否   | 节点ID筛选   |
| type   | string | 否   | 场景类型筛选 |

#### 响应示例

```json
{
  "success": true,
  "data": [
    {
      "id": "scene_ruijin_start",
      "nodeId": "ruijin",
      "type": "narrative",
      "title": "瑞金出发",
      "content": "场景内容...",
      "characters": [
        {
          "id": "mao",
          "name": "毛泽东",
          "role": "leader"
        }
      ],
      "choices": [
        {
          "id": "choice_1",
          "text": "选择文本",
          "consequence": "选择后果"
        }
      ]
    }
  ]
}
```

### 获取单个场景

**GET** `/api/scenes/{sceneId}`

根据场景ID获取详细信息。

#### 路径参数

| 参数    | 类型   | 必填 | 描述         |
| ------- | ------ | ---- | ------------ |
| sceneId | string | 是   | 场景唯一标识 |

## 成就系统API

### 获取成就数据

**GET** `/api/achievements`

获取所有成就定义。

#### 响应示例

```json
{
  "success": true,
  "data": [
    {
      "id": "first_step",
      "name": "第一步",
      "description": "开始长征之旅",
      "icon": "/assets/achv/first_step.svg",
      "type": "milestone",
      "points": 10,
      "requirements": {
        "type": "visit_node",
        "nodeId": "ruijin"
      }
    }
  ]
}
```

## 演示脚本API

### 获取演示脚本

**GET** `/api/demo-script`

获取自动演示的脚本数据。

#### 响应示例

```json
{
  "success": true,
  "data": {
    "id": "long_march_demo",
    "title": "长征演示",
    "duration": 300,
    "steps": [
      {
        "id": "intro",
        "type": "narration",
        "duration": 10,
        "content": "欢迎来到长征之旅..."
      }
    ]
  }
}
```

## 用户进度API

### 保存用户进度

**POST** `/api/user/progress`

保存用户的游戏进度。

**需要认证**: 是

#### 请求参数

```json
{
  "userId": "string",
  "currentNode": "string",
  "visitedNodes": ["string"],
  "achievements": ["string"],
  "choices": [
    {
      "sceneId": "string",
      "choiceId": "string",
      "timestamp": "string"
    }
  ],
  "statistics": {
    "totalTime": 3600,
    "nodesVisited": 5,
    "achievementsUnlocked": 3
  }
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "progressId": "progress123",
    "savedAt": "2024-01-01T00:00:00Z"
  },
  "message": "进度保存成功"
}
```

### 加载用户进度

**GET** `/api/user/progress/{userId}`

加载指定用户的进度数据。

**需要认证**: 是

#### 路径参数

| 参数   | 类型   | 必填 | 描述   |
| ------ | ------ | ---- | ------ |
| userId | string | 是   | 用户ID |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "currentNode": "xiangjiang",
    "visitedNodes": ["ruijin", "xiangjiang"],
    "achievements": ["first_step", "river_crosser"],
    "choices": [],
    "statistics": {
      "totalTime": 1800,
      "nodesVisited": 2,
      "achievementsUnlocked": 2
    },
    "lastSaved": "2024-01-01T00:00:00Z"
  }
}
```

## 数据分析API

### 提交用户选择

**POST** `/api/analytics/choice`

记录用户在场景中的选择，用于数据分析。

#### 请求参数

```json
{
  "userId": "string",
  "sceneId": "string",
  "choiceId": "string",
  "timestamp": "string",
  "sessionId": "string"
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "recordId": "record123"
  },
  "message": "选择记录成功"
}
```

### 获取统计数据

**GET** `/api/analytics/statistics`

获取系统统计数据。

#### 查询参数

| 参数   | 类型   | 必填 | 描述                             |
| ------ | ------ | ---- | -------------------------------- |
| period | string | 否   | 统计周期：day/week/month         |
| type   | string | 否   | 统计类型：users/choices/progress |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "activeUsers": 89,
    "totalSessions": 3456,
    "averageSessionTime": 1800,
    "popularNodes": [
      {
        "nodeId": "ruijin",
        "visits": 1250
      }
    ],
    "choiceDistribution": {
      "scene_ruijin_start": {
        "choice_1": 60,
        "choice_2": 40
      }
    }
  }
}
```

## 搜索API

### 搜索节点

**GET** `/api/search/nodes`

根据关键词搜索节点。

#### 查询参数

| 参数  | 类型   | 必填 | 描述                 |
| ----- | ------ | ---- | -------------------- |
| q     | string | 是   | 搜索关键词           |
| limit | number | 否   | 结果数量限制，默认10 |
| lang  | string | 否   | 搜索语言：zh/en      |

#### 响应示例

```json
{
  "success": true,
  "data": [
    {
      "id": "ruijin",
      "name_zh": "瑞金出发",
      "name_en": "Departure from Ruijin",
      "summary_zh": "中央红军从瑞金出发...",
      "relevance": 0.95
    }
  ],
  "total": 1
}
```

## 系统监控API

### 健康检查

**GET** `/api/health`

检查服务器运行状态。

#### 响应示例

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0.0",
    "uptime": 86400,
    "services": {
      "database": "connected",
      "cache": "connected",
      "storage": "available"
    }
  }
}
```

## 错误代码

| 错误代码            | HTTP状态码 | 描述           |
| ------------------- | ---------- | -------------- |
| AUTH_REQUIRED       | 401        | 需要认证       |
| AUTH_INVALID        | 401        | 认证无效       |
| AUTH_EXPIRED        | 401        | 认证已过期     |
| FORBIDDEN           | 403        | 权限不足       |
| NOT_FOUND           | 404        | 资源不存在     |
| VALIDATION_ERROR    | 400        | 参数验证失败   |
| RATE_LIMIT          | 429        | 请求频率超限   |
| SERVER_ERROR        | 500        | 服务器内部错误 |
| SERVICE_UNAVAILABLE | 503        | 服务不可用     |

## 认证说明

### JWT Token格式

```
Authorization: Bearer <token>
```

### Token载荷示例

```json
{
  "userId": "user123",
  "username": "testuser",
  "role": "user",
  "iat": 1640995200,
  "exp": 1641081600
}
```

## 限流规则

- 未认证用户：每分钟60次请求
- 认证用户：每分钟300次请求
- 搜索API：每分钟30次请求
- 上传API：每分钟10次请求

## 数据库设计

### 主要数据表

1. **users** - 用户信息
2. **nodes** - 节点数据
3. **routes** - 路线数据
4. **scenes** - 场景数据
5. **achievements** - 成就定义
6. **user_progress** - 用户进度
7. **user_achievements** - 用户成就
8. **analytics_choices** - 选择记录
9. **sessions** - 会话记录

## 部署说明

### 环境变量

```bash
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=longmarch
DB_USER=postgres
DB_PASSWORD=password

# JWT配置
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# 服务配置
PORT=3000
NODE_ENV=production

# 文件存储
UPLOAD_PATH=/uploads
MAX_FILE_SIZE=10MB

# 缓存配置
REDIS_URL=redis://localhost:6379
```

### Docker部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 版本历史

- **v1.0.0** - 初始版本，包含基础功能
- **v1.1.0** - 添加搜索和分析功能
- **v1.2.0** - 优化性能，添加缓存
- **v1.3.0** - 添加实时功能和WebSocket支持

---

_文档最后更新时间：2024年1月1日_
