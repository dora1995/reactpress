import api from '../utils/api';

export const membershipTypeAPI = {
  getMembershipTypes: () => api.get('/membership-type'),
  
  getMembershipTypeById: (id: string) => api.get(`/membership-type/${id}`),
  
  createMembershipType: (data: any) => api.post('/membership-type', data),
  
  updateMembershipType: (id: string, data: any) =>
  api.put(`/membership-type/${id}`, data),
  
  deleteMembershipType: (id: string) => api.delete(`/membership-type/${id}`),
};