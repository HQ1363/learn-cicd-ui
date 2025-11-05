/**
 * Mock Axios 实例
 * 用于拦截 tiklab-core-ui 的 Axios 请求
 */
import { getMockData } from "./MockData";

// 是否启用 Mock 模式（支持 development 和 dev）
const USE_MOCK = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev';

/**
 * 创建 Mock Axios 实例
 */
class MockAxios {
    /**
     * POST 请求
     */
    post(url, data, config) {
        if (USE_MOCK) {
            console.log('[MockAxios] POST 请求:', url, data);
            
            return new Promise((resolve) => {
                setTimeout(() => {
                    const mockData = getMockData(url, data);
                    resolve(mockData);
                }, 100);
            });
        }
        
        // 如果不是 Mock 模式，需要从 tiklab-core-ui 导入真实的 Axios
        // 这里作为备用方案
        console.error('[MockAxios] Mock 模式未启用，但调用了 MockAxios');
        return Promise.resolve({
            code: 0,
            msg: 'success',
            data: null
        });
    }

    /**
     * GET 请求
     */
    get(url, config) {
        if (USE_MOCK) {
            console.log('[MockAxios] GET 请求:', url);
            
            return new Promise((resolve) => {
                setTimeout(() => {
                    const mockData = getMockData(url, config?.params);
                    resolve(mockData);
                }, 100);
            });
        }
        
        return Promise.resolve({
            code: 0,
            msg: 'success',
            data: null
        });
    }

    /**
     * PUT 请求
     */
    put(url, data, config) {
        if (USE_MOCK) {
            console.log('[MockAxios] PUT 请求:', url, data);
            
            return new Promise((resolve) => {
                setTimeout(() => {
                    const mockData = getMockData(url, data);
                    resolve(mockData);
                }, 100);
            });
        }
        
        return Promise.resolve({
            code: 0,
            msg: 'success',
            data: null
        });
    }

    /**
     * DELETE 请求
     */
    delete(url, config) {
        if (USE_MOCK) {
            console.log('[MockAxios] DELETE 请求:', url);
            
            return new Promise((resolve) => {
                setTimeout(() => {
                    const mockData = getMockData(url, config?.data);
                    resolve(mockData);
                }, 100);
            });
        }
        
        return Promise.resolve({
            code: 0,
            msg: 'success',
            data: null
        });
    }
}

const mockAxiosInstance = new MockAxios();

export default mockAxiosInstance;

