/**
 * 初始化 Mock 配置
 * 在应用启动时调用，拦截所有 API 请求
 */
import { getMockData } from "./MockData";

// 是否启用 Mock 模式（支持 development 和 dev）
const USE_MOCK = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev';

/**
 * 模拟用户登录状态
 */
const mockUserLogin = () => {
    // 模拟登录用户信息
    const mockUser = {
        userId: 'mock-user-001',
        username: 'admin',
        nickname: '管理员',
        email: 'admin@test.com',
        phone: '13800138000',
        status: 1,
        createTime: '2024-01-01 00:00:00'
    };
    
    // 存储用户信息到localStorage（模拟登录）
    localStorage.setItem('userId', mockUser.userId);
    localStorage.setItem('username', mockUser.username);
    localStorage.setItem('nickname', mockUser.nickname);
    
    // 存储用户信息到sessionStorage
    sessionStorage.setItem('user', JSON.stringify(mockUser));
    
    console.log('[Mock] 👤 已模拟用户登录状态:', mockUser.username);
};

/**
 * 初始化 Mock 拦截器
 */
export const initMock = () => {
    if (!USE_MOCK) {
        console.log('[Mock] Mock 模式未启用');
        return;
    }

    console.log('[Mock] 🎭 启用 Mock 模式，所有 API 请求将返回 Mock 数据');
    
    // 模拟用户登录状态
    mockUserLogin();

    // 延迟导入 Axios，避免循环依赖
    setTimeout(() => {
        try {
            const { Axios } = require("tiklab-core-ui");
            
            if (!Axios) {
                console.error('[Mock] 无法获取 Axios 实例');
                return;
            }

            // 保存原始的 Axios 方法
            const originalPost = Axios.post;
            const originalGet = Axios.get;
            const originalPut = Axios.put;
            const originalDelete = Axios.delete;

            /**
             * 拦截 POST 请求
             */
            Axios.post = function(url, data, config) {
                console.log('[Mock] 拦截 POST 请求:', url);
                
                return new Promise((resolve) => {
                    setTimeout(() => {
                        // 处理FormData类型的数据
                        let processedData = data;
                        if (data instanceof FormData) {
                            processedData = {};
                            for (let [key, value] of data.entries()) {
                                processedData[key] = value;
                            }
                            console.log('[Mock] FormData 转换:', processedData);
                        }
                        
                        const mockData = getMockData(url, processedData);
                        console.log('[Mock] 返回 Mock 数据:', mockData);
                        resolve(mockData);
                    }, 100); // 模拟网络延迟
                });
            };

            /**
             * 拦截 GET 请求
             */
            Axios.get = function(url, config) {
                console.log('[Mock] 拦截 GET 请求:', url);
                
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const mockData = getMockData(url, config?.params);
                        console.log('[Mock] 返回 Mock 数据:', mockData);
                        resolve(mockData);
                    }, 100);
                });
            };

            /**
             * 拦截 PUT 请求
             */
            Axios.put = function(url, data, config) {
                console.log('[Mock] 拦截 PUT 请求:', url);
                
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const mockData = getMockData(url, data);
                        console.log('[Mock] 返回 Mock 数据:', mockData);
                        resolve(mockData);
                    }, 100);
                });
            };

            /**
             * 拦截 DELETE 请求
             */
            Axios.delete = function(url, config) {
                console.log('[Mock] 拦截 DELETE 请求:', url);
                
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const mockData = getMockData(url, config?.data);
                        console.log('[Mock] 返回 Mock 数据:', mockData);
                        resolve(mockData);
                    }, 100);
                });
            };

            // 添加恢复原始方法的功能（用于调试）
            window.__restoreMock = () => {
                console.log('[Mock] 恢复原始 Axios 方法');
                Axios.post = originalPost;
                Axios.get = originalGet;
                Axios.put = originalPut;
                Axios.delete = originalDelete;
            };

            console.log('[Mock] ✅ Mock 拦截器初始化完成');
            console.log('[Mock] 提示: 打开浏览器控制台可以看到所有被拦截的请求');
            console.log('[Mock] 提示: 如需恢复真实请求，在控制台执行: window.__restoreMock()');
        } catch (error) {
            console.error('[Mock] 初始化失败:', error);
        }
    }, 0);
};

export default initMock;
