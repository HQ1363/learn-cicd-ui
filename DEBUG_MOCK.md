# Mock 系统调试指南

## 当前状态

根据控制台日志，Mock 系统已正常启动：

```
[Mock] 🎭 启用 Mock 模式，所有 API 请求将返回 Mock 数据
[Mock] 👤 已模拟用户登录状态: admin
[Mock] ✅ Mock 拦截器初始化完成
[Mock] 拦截 POST 请求: /init/install/findStatus
[Mock] 返回 Mock 数据: {code: 0, msg: 'success', data: {installStatus: true, initStatus: true}}
```

## 页面白屏的可能原因

### 1. content.js 错误（浏览器插件）

错误信息：
```
content.js:2 Uncaught TypeError: p is not a function
```

**这是浏览器插件的错误，不是我们的代码问题。**

**解决方法**：禁用所有浏览器扩展后重试

#### 如何禁用扩展：

**Chrome/Edge：**
1. 打开新标签页
2. 输入 `chrome://extensions/`
3. 禁用所有扩展
4. 刷新 `http://localhost:8000`

**或者使用无痕模式：**
- Mac: `Cmd + Shift + N`
- Windows: `Ctrl + Shift + N`

### 2. React 渲染错误

打开浏览器控制台（F12），查看 **Console** 标签是否有 React 相关错误。

### 3. 检查 HTML 是否加载

在控制台执行：
```javascript
document.getElementById('root')
```

如果返回 `null`，说明 HTML 没有正确加载。

### 4. 检查 JS 文件是否加载

切换到 **Network** 标签，查看：
- `index.html` - 应该是 200 状态
- `main.[hash].js` - 应该是 200 状态

### 5. 检查是否有其他拦截的请求

在控制台查看是否还有其他 API 请求被拦截但返回了 null。

## 调试步骤

### 步骤 1：禁用浏览器扩展

使用无痕模式或禁用所有扩展后访问：
```
http://localhost:8000
```

### 步骤 2：检查控制台错误

打开 F12，查看 Console 标签，复制所有红色错误信息。

### 步骤 3：检查 React 是否渲染

在控制台执行：
```javascript
// 检查 root 元素
document.getElementById('root')

// 检查是否有 React 内容
document.getElementById('root').innerHTML

// 检查 localStorage
localStorage.getItem('userId')
localStorage.getItem('username')
```

### 步骤 4：检查 Mock 数据

在控制台执行：
```javascript
// 手动触发一个 API 请求
const { Axios } = require("tiklab-core-ui");
Axios.post('/pipeline/findUserPipelinePage', {
    pageParam: {pageSize: 10, currentPage: 1}
}).then(res => console.log('测试结果:', res));
```

### 步骤 5：查看完整的错误栈

如果有 React 错误，点击错误信息查看完整的调用栈。

## 常见问题

### Q: 页面白屏但控制台没有错误

可能是 CSS 没有加载，检查 Network 标签中的 CSS 文件。

### Q: 页面白屏且有 React 错误

查看具体的 React 错误信息，可能是某个组件渲染失败。

### Q: content.js 错误导致页面白屏

在无痕模式下访问，或者禁用所有浏览器扩展。

## 快速测试

在控制台执行以下代码测试 Mock 系统：

```javascript
// 测试 Mock 是否工作
console.log('=== Mock 系统测试 ===');
console.log('USER ID:', localStorage.getItem('userId'));
console.log('USERNAME:', localStorage.getItem('username'));

// 测试 API 拦截
if (window.Axios) {
    window.Axios.post('/pipeline/findUserPipelinePage', {
        pageParam: {pageSize: 10, currentPage: 1}
    }).then(res => {
        console.log('✅ Pipeline API 测试成功:', res);
    }).catch(err => {
        console.error('❌ Pipeline API 测试失败:', err);
    });
}
```

## 临时解决方案

如果问题持续，可以尝试：

### 方案 1：清除缓存
```bash
# 浏览器中按 Ctrl+Shift+Delete
# 选择"缓存的图片和文件"
# 点击"清除数据"
```

### 方案 2：重新安装依赖
```bash
rm -rf node_modules
npm install
npm run arbess-start
```

### 方案 3：使用不同的浏览器
尝试使用 Firefox 或 Safari 访问。

## 需要提供的信息

如果问题仍然存在，请提供：

1. **完整的控制台错误**（红色的部分）
2. **Network 标签的截图**（显示所有请求）
3. **执行调试代码的结果**
4. **浏览器和版本**（如 Chrome 120）
5. **是否在无痕模式下测试**

---

**提示**：大部分白屏问题都是由浏览器扩展引起的，建议先在无痕模式下测试。

