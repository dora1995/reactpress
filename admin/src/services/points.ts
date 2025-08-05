
import api from '../utils/api';

export const pointsAPI = {
  // 用户积分管理
  getUserPoints: (userId: string) => api.get(`/user-points/user/${userId}`),
  
  addPoints: (data: {
    userId: string;
    points: number;
    type: string;
    description: string;
    orderId?: string;
  }) => api.post('/user-points/add', data),
  
  deductPoints: (data: {
    userId: string;
    points: number;
    type: string;
    description: string;
    articleId?: string;
  }) => api.post('/user-points/deduct', data),
  
  // 积分交易记录
  getTransactionHistory: (userId: string) => api.get(`/user-points/transactions/${userId}`),
};