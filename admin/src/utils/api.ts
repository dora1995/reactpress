import axios, { type AxiosResponse } from 'axios';
import { message } from 'antd';

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:3002/api/', // 根据你的后端服务地址调整
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse<{
    statusCode: number;
    success: boolean;
    msg: string | null;
    data: any;
  }>) => {
    const res = response.data;

    if (!res.success) {
      message.error(res.msg);
      return null;
    }
    return res.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else {
      message.error(error.response?.data?.message || '请求失败');
    }
    return Promise.reject(error);
  }
);

export default api;