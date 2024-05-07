import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseURL + '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 创建一个类型守卫，确保config满足InternalAxiosRequestConfig的类型
function ensureInternalConfig(config: AxiosRequestConfig): config is InternalAxiosRequestConfig {
  if (!config.headers) {
    config.headers = {};  // 确保headers不为undefined
  }
  // 这里可以添加更多的检查来确保config满足InternalAxiosRequestConfig的其他属性要求
  return true;
}

// 请求拦截器：为每个请求添加JWT
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
    if (ensureInternalConfig(config)) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config as InternalAxiosRequestConfig;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 响应拦截器：处理错误和token刷新
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('Unauthorized access - Token expired or invalid');
          break;
        case 403:
          console.error('Forbidden access');
          break;
        default:
          console.error('An error occurred');
      }
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error setting up request');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
