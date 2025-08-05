import api from '../utils/api';

export const transactionAPI = {
  // 会员交易记录
  getMembershipTransactions: (userId: string) =>
  api.get(`/membership-transaction/user/${userId}`),
  
  createMembershipTransaction: (data: {
    userId: string;
    membershipTypeId: string;
    amount: number;
    paymentMethod: string;
  }) => api.post('/membership-transaction/create', data),
  
  handlePaymentSuccess: (data: { orderId: string; paymentTime?: Date }) =>
  api.post('/membership-transaction/payment-success', data),
  
  handlePaymentFailure: (data: { orderId: string }) =>
  api.post('/membership-transaction/payment-failure', data),
};