# 开发环境 Mock 模式使用指南

## 概述

本项目已经配置了完整的 Mock 系统，可以在开发环境下**完全不依赖后端API**运行。所有的数据都是测试数据，支持 Pipeline 的增删改查等所有操作。

## 功能特性

✅ **自动绕过登录验证** - 开发环境下直接进入应用，无需登录  
✅ **自动 Mock 用户状态** - 自动模拟管理员用户登录  
✅ **拦截所有 API 请求** - 所有后端请求都被拦截并返回 Mock 数据  
✅ **支持 Pipeline CRUD** - 完整支持流水线的创建、删除、更新、查看、克隆、收藏等操作  
✅ **实时数据更新** - Mock 数据存储在内存中，操作会实时反映在界面上  
✅ **完整权限模拟** - 模拟管理员权限，可以访问所有功能  

## 快速开始

### 1. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

### 2. 访问应用

打开浏览器访问 `http://localhost:8080` (或配置的端口)，会自动进入应用首页。

### 3. 开始使用

- 直接点击"新建流水线"创建流水线
- 查看流水线列表
- 编辑、删除、克隆流水线
- 收藏/取消收藏流水线
- 所有操作都在内存中进行，刷新页面后会重置

## 技术实现

### 1. Mock 系统架构

```
src/index.js (入口)
  ↓
src/common/utils/InitMock.js (初始化 Mock 拦截器)
  ↓
拦截 Axios 请求
  ↓
src/common/utils/MockData.js (返回 Mock 数据)
```

### 2. 核心文件说明

#### `src/common/utils/InitMock.js`
- 初始化 Mock 拦截器
- 拦截所有 Axios 请求（POST、GET、PUT、DELETE）
- 模拟用户登录状态
- 处理 FormData 类型的请求数据

#### `src/common/utils/MockData.js`
- 定义所有 Mock 数据
- 实现 CRUD 操作的业务逻辑
- 数据存储在内存中（刷新后重置）

#### `src/common/layout/Layout.js`
- 开发环境下不使用 `UserVerify` 登录验证
- 直接渲染应用内容

#### `src/routes.js`
- 开发环境下不加载登录相关路由
- 默认路由直接到首页

### 3. Mock 数据存储

Mock 数据存储在 JavaScript 变量中：

```javascript
let mockPipelines = [
    // 初始化 3 个测试流水线
    { id: 'pipeline-001', name: 'Web前端构建流水线', ... },
    { id: 'pipeline-002', name: 'Java后端服务流水线', ... },
    { id: 'pipeline-003', name: 'Docker镜像构建流水线', ... }
];
```

所有操作（创建、更新、删除）都会修改这个数组，实时反映在界面上。

## 支持的功能

### Pipeline 功能
- ✅ 查询流水线列表（支持分页、筛选、搜索）
- ✅ 创建流水线
- ✅ 更新流水线
- ✅ 删除流水线
- ✅ 克隆流水线
- ✅ 收藏/取消收藏
- ✅ 查看流水线详情
- ✅ 导出 YAML
- ✅ 流水线统计
- ✅ 常用流水线

### 环境管理
- ✅ 查询环境列表
- ✅ 创建/更新/删除环境

### 应用分组
- ✅ 查询分组列表
- ✅ 创建/更新/删除分组

### 用户管理
- ✅ 查询用户列表
- ✅ 用户权限验证（总是返回 true）

### 其他功能
- ✅ 消息通知
- ✅ 历史记录
- ✅ 测试报告
- ✅ 资源统计
- ✅ 版本信息
- ✅ 授权信息

## 调试技巧

### 1. 查看 Mock 日志

打开浏览器控制台（F12），可以看到所有被拦截的请求：

```
[Mock] 🎭 启用 Mock 模式，所有 API 请求将返回 Mock 数据
[Mock] 👤 已模拟用户登录状态: admin
[Mock] ✅ Mock 拦截器初始化完成
[Mock] 拦截 POST 请求: /pipeline/findUserPipelinePage
[Mock] 返回 Mock 数据: {code: 0, msg: 'success', data: {...}}
```

### 2. 恢复真实请求

如果需要临时恢复真实的后端请求（用于调试），在浏览器控制台执行：

```javascript
window.__restoreMock()
```

这会恢复原始的 Axios 方法，重新发送真实的后端请求。

### 3. 修改 Mock 数据

如果需要修改默认的 Mock 数据，编辑 `src/common/utils/MockData.js` 文件：

```javascript
// 修改初始流水线数据
let mockPipelines = [
    {
        id: 'pipeline-001',
        name: '你的流水线名称',
        description: '你的描述',
        // ... 其他字段
    }
];
```

### 4. 添加新的 API Mock

在 `mockDataMap` 对象中添加新的 API 路径：

```javascript
const mockDataMap = {
    // 你的新 API
    '/your/api/path': (data) => {
        return successResponse({
            // 你的返回数据
        });
    },
    // ... 其他 API
};
```

## 环境变量

Mock 系统根据 `NODE_ENV` 环境变量自动启用：

- `development` - 自动启用 Mock 模式
- `production` - 不启用 Mock 模式，使用真实后端 API

## 注意事项

⚠️ **数据持久化** - Mock 数据存储在内存中，刷新页面后会重置为初始状态  
⚠️ **网络延迟** - Mock 响应有 100ms 的模拟延迟，保持真实感  
⚠️ **FormData 处理** - 系统会自动将 FormData 转换为普通对象  
⚠️ **仅开发环境** - Mock 系统只在开发环境启用，生产环境不受影响  

## 常见问题

### Q: 为什么我看不到登录页面？
A: 开发环境下已经绕过登录验证，直接进入应用。这是预期行为。

### Q: 我添加的流水线刷新后消失了？
A: Mock 数据存储在内存中，刷新页面会重置。如需持久化，需要连接真实后端。

### Q: 如何添加更多测试数据？
A: 编辑 `src/common/utils/MockData.js` 文件，在 `mockPipelines` 数组中添加更多数据。

### Q: Mock 系统影响生产环境吗？
A: 不会。Mock 系统只在 `NODE_ENV === 'development'` 时启用。

### Q: 如何临时禁用 Mock？
A: 在浏览器控制台执行 `window.__restoreMock()` 可以临时恢复真实请求。

## 维护建议

1. **定期更新 Mock 数据** - 当后端 API 变化时，同步更新 Mock 数据结构
2. **完善 Mock 覆盖** - 为新功能添加相应的 Mock 接口
3. **保持数据真实性** - Mock 数据应该尽量模拟真实场景
4. **添加详细日志** - 在 Mock 函数中添加 console.log，方便调试

## 扩展阅读

- [MockData.js 完整 API 列表](./src/common/utils/MockData.js)
- [InitMock.js 拦截器实现](./src/common/utils/InitMock.js)
- [MOCK_README.md 详细说明](./MOCK_README.md)

---

🎉 现在你可以完全独立于后端进行前端开发了！

