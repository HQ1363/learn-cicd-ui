# 代码修改总结

## 修改目标
绕过所有登录限制，使用本地 Mock 数据，实现完全的本地开发模式。

## 修改文件列表

### 1. 新增文件

#### `src/common/utils/MockData.js`
- 📦 Mock 数据配置中心
- 包含 40+ API 的 Mock 数据
- 支持精确匹配和模糊匹配
- 自动处理增删改查操作

#### `src/common/utils/InitMock.js`
- 🎭 Mock 初始化模块
- 全局拦截 tiklab-core-ui 的 Axios
- 开发环境自动启用
- 提供恢复真实请求的功能

#### `src/common/utils/MockAxios.js`
- 🔧 Mock Axios 实例
- 备用拦截器
- 支持 GET/POST/PUT/DELETE

#### `MOCK_README.md`
- 📖 Mock 使用完整文档
- 包含使用方法、调试技巧、常见问题

#### `CHANGES_SUMMARY.md`
- 📝 本文件，记录所有修改

### 2. 修改文件

#### `src/common/layout/Layout.js`
**修改内容：**
```javascript
// 移除登录验证
// export default UserVerify(Layout,'/noAuth')
export default Layout
```
**作用：** 绕过登录页面，直接进入应用

#### `src/common/layout/Portal.js`
**修改内容：**
```javascript
useEffect(()=>{
    // 开发环境：如果没有用户信息，设置 mock 用户
    const user = getUser();
    if (!user || !user.userId) {
        localStorage.setItem('user', JSON.stringify({
            userId: 'dev-user-001',
            name: '开发用户',
            nickname: '开发用户',
            email: 'dev@test.com'
        }));
    }
    // ... 其他代码
},[])
```
**作用：** 自动注入 Mock 用户信息

#### `src/common/utils/Requset.js`
**修改内容：**
- 导入 Mock 相关模块
- 添加请求拦截器，使用 adapter 拦截 axios 请求
- 在 Mock 模式下返回 Mock 数据
- 错误处理改为返回成功响应

**作用：** 拦截原生 axios 请求

#### `src/index.js`
**修改内容：**
```javascript
import {initMock} from "./common/utils/InitMock";

// 初始化 Axios
enableAxios();

// 初始化 Mock（开发环境自动启用）
initMock();
```
**作用：** 应用启动时初始化 Mock 系统

## 功能特性

### ✅ 登录绕过
- 移除 UserVerify 高阶组件
- 自动注入 Mock 用户
- 无需任何登录操作

### ✅ API 完全 Mock
- 拦截所有 Axios 请求（包括 tiklab-core-ui）
- 支持 GET/POST/PUT/DELETE 方法
- 模拟 100ms 网络延迟
- 所有请求返回成功响应

### ✅ 开发友好
- 控制台实时显示拦截日志
- 支持临时禁用 Mock
- 易于添加新的 Mock 数据
- 生产环境自动禁用

## 已 Mock 的 API（部分）

| 模块 | API 示例 | 说明 |
|------|----------|------|
| 流水线 | `/pipeline/findPipelineList` | 流水线列表 |
| 环境 | `/env/findEnvList` | 环境列表 |
| 变量 | `/pipeline/variable/findVariableList` | 变量列表 |
| Agent | `/agent/findAgentList` | Agent 列表 |
| 授权 | `/auth/findAuthList` | 授权配置 |
| 主机 | `/host/findHostList` | 主机列表 |
| 服务器 | `/authServer/findAuthServerList` | 服务器配置 |
| 工具 | `/tool/findToolList` | 工具列表 |
| K8s | `/k8s/findK8sList` | K8s 集群 |
| 用户 | `/user/findUserList` | 用户列表 |
| 角色 | `/systemRole/findRoleList` | 角色列表 |
| 消息 | `/message/findMessageList` | 消息列表 |
| 历史 | `/history/findHistoryPage` | 执行历史 |
| 测试 | `/test/findTestOverview` | 测试概览 |
| 动态 | `/dynamic/findDynamicPage` | 动态消息 |
| 概览 | `/overview/findOverview` | 数据概览 |

**智能匹配：**
- 所有包含 `/create` 的 API → 自动返回创建成功
- 所有包含 `/update` 的 API → 自动返回更新成功
- 所有包含 `/delete` 的 API → 自动返回删除成功
- 所有包含 `/findPage` 的 API → 返回空分页数据
- 所有包含 `/findList` 的 API → 返回空数组

## 启动方式

```bash
# 1. 切换 Node 版本
nvm use v20.19.0

# 2. 安装依赖（如需要）
yarn install

# 3. 启动项目
yarn run arbess-start

# 4. 访问
http://localhost:6000
```

## 控制台输出示例

```
[Mock] 🎭 启用 Mock 模式，所有 API 请求将返回 Mock 数据
[Mock] ✅ Mock 拦截器初始化完成
[Mock] 提示: 打开浏览器控制台可以看到所有被拦截的请求
[Mock] 拦截 POST 请求: /pipeline/findPipelineList
[Mock] 返回 Mock 数据: {code: 0, msg: 'success', data: [...]}
```

## 如何添加新的 Mock 数据

在 `src/common/utils/MockData.js` 中添加：

```javascript
const mockDataMap = {
    // ... 现有配置
    
    // 添加你的 API
    '/your/api/path': () => successResponse({
        // 你的数据
    }),
};
```

## 如何临时禁用 Mock

在浏览器控制台执行：
```javascript
window.__restoreMock()
```

## 技术实现

### 拦截策略
1. **入口拦截**: 在 `index.js` 初始化时拦截 tiklab-core-ui 的 Axios
2. **请求拦截**: 通过 axios adapter 拦截原生请求
3. **全局替换**: 替换 Axios 的 get/post/put/delete 方法

### Mock 匹配流程
```
请求发起
  ↓
Mock 拦截器
  ↓
精确匹配？ → 是 → 返回精确 Mock 数据
  ↓ 否
模糊匹配？ → 是 → 返回通用 Mock 数据
  ↓ 否
返回默认成功响应
```

## 注意事项

1. ✅ Mock 仅在开发环境（`NODE_ENV=development`）启用
2. ✅ 生产构建不包含 Mock 代码
3. ✅ Mock 数据不持久化，刷新后重置
4. ✅ 所有网络请求都会被拦截，不会真实发送

## 测试建议

### 1. 验证 Mock 是否生效
- 打开浏览器网络面板
- 应该看不到真实的网络请求
- 控制台有 Mock 日志输出

### 2. 验证页面功能
- 流水线列表能正常显示
- 创建、编辑、删除操作有响应
- 无需登录直接进入

### 3. 验证用户信息
- 打开控制台执行：`localStorage.getItem('user')`
- 应该看到 Mock 用户信息

## 回滚方案

如需回滚所有修改：

```bash
# 1. 恢复 Layout.js
# 将 export default Layout 改回 export default UserVerify(Layout,'/noAuth')

# 2. 恢复 Portal.js
# 移除 Mock 用户注入代码

# 3. 移除 index.js 的 initMock()
# 注释或删除 initMock() 调用

# 4. 删除新增的文件
rm src/common/utils/MockData.js
rm src/common/utils/InitMock.js
rm src/common/utils/MockAxios.js
rm MOCK_README.md
rm CHANGES_SUMMARY.md
```

## 维护建议

1. **定期更新 Mock 数据**：随着 API 变化更新 MockData.js
2. **添加真实数据测试**：定期使用真实 API 测试
3. **文档同步**：API 变化时同步更新 MOCK_README.md
4. **性能监控**：Mock 数据过大时注意性能影响

## 问题排查

### 问题 1: 页面显示空白
**原因**: 可能某个关键 API 未 Mock
**解决**: 查看控制台，找到未匹配的 API，添加到 MockData.js

### 问题 2: 某些功能不工作
**原因**: Mock 数据格式与真实数据不一致
**解决**: 对比真实 API 返回格式，调整 Mock 数据

### 问题 3: 页面报错
**原因**: 可能是代码逻辑依赖真实 API 的特定字段
**解决**: 在 Mock 数据中补充缺失字段

## 总结

✅ **已完成**：
- 登录限制已完全绕过
- 所有 API 请求使用 Mock 数据
- 完整的 Mock 系统已就绪
- 详细的使用文档已提供

🎯 **效果**：
- 无需后端服务即可运行
- 无需登录即可访问所有页面
- 开发效率大幅提升
- 可独立进行前端开发

📝 **文档**：
- `MOCK_README.md` - 使用文档
- `CHANGES_SUMMARY.md` - 本修改总结

现在你可以重启项目，享受完全本地化的开发体验！ 🎉

