import axios, { AxiosError } from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

const axiosInstance = axios.create({
  baseURL: baseURL,
  // 其他 axios 实例配置选项
});

axiosInstance.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response) {
      // 例如处理401, 403等状态码错误
      switch (error.response.status) {
        case 401:
          console.error('Unauthorized access');
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
