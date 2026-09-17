import api from './api';

export const adminService = {
  // 1. Users Management
  getUsers: async (params = {}) => {
    return await api.get('/admin/users', { params });
  },

  getUserById: async (id) => {
    return await api.get(`/admin/users/${id}`);
  },

  updateUserStatus: async (id, status) => {
    return await api.patch(`/admin/users/${id}/status`, { status });
  },

  deleteUser: async (id) => {
    return await api.delete(`/admin/users/${id}`);
  },

  // 2. Properties Management & Moderation
  getProperties: async (params = {}) => {
    return await api.get('/admin/properties', { params });
  },

  getPropertyById: async (id) => {
    return await api.get(`/admin/properties/${id}`);
  },

  updatePropertyVerification: async (id, { verificationStatus, rejectionReason = '' }) => {
    return await api.patch(`/admin/properties/${id}/verification`, {
      verificationStatus,
      rejectionReason,
    });
  },

  updatePropertyStatus: async (id, status) => {
    return await api.patch(`/admin/properties/${id}/status`, { status });
  },

  deleteProperty: async (id) => {
    return await api.delete(`/admin/properties/${id}`);
  },

  // 3. Agents Management
  getAgents: async (params = {}) => {
    return await api.get('/admin/agents', { params });
  },

  getAgentById: async (id) => {
    return await api.get(`/admin/agents/${id}`);
  },

  updateAgentVerification: async (id, verificationStatus) => {
    return await api.patch(`/admin/agents/${id}/verification`, { verificationStatus });
  },

  updateAgentStatus: async (id, status) => {
    return await api.patch(`/admin/agents/${id}/status`, { status });
  },

  // 4. Agencies Management
  getAgencies: async (params = {}) => {
    return await api.get('/admin/agencies', { params });
  },

  getAgencyById: async (id) => {
    return await api.get(`/admin/agencies/${id}`);
  },

  updateAgencyVerification: async (id, verificationStatus) => {
    return await api.patch(`/admin/agencies/${id}/verification`, { verificationStatus });
  },

  updateAgencyStatus: async (id, status) => {
    return await api.patch(`/admin/agencies/${id}/status`, { status });
  },

  // 5. Reports & Compliance
  getReports: async (params = {}) => {
    return await api.get('/admin/reports', { params });
  },

  updateReportStatus: async (id, { status, resolutionNotes = '' }) => {
    return await api.patch(`/admin/reports/${id}/status`, { status, resolutionNotes });
  },

  resolveReportAction: async (id, { action, reason = '' }) => {
    return await api.post(`/admin/reports/${id}/action`, { action, reason });
  },

  // 6. Reviews Moderation
  getReviews: async (params = {}) => {
    return await api.get('/admin/reviews', { params });
  },

  updateReviewVisibility: async (id, isHidden) => {
    return await api.patch(`/admin/reviews/${id}/visibility`, { isHidden });
  },

  deleteReview: async (id) => {
    return await api.delete(`/admin/reviews/${id}`);
  },

  // 7. Customer Inquiries
  getInquiries: async (params = {}) => {
    return await api.get('/admin/inquiries', { params });
  },

  updateInquiryStatus: async (id, status) => {
    return await api.patch(`/admin/inquiries/${id}/status`, { status });
  },

  // 8. Viewing Requests
  getViewings: async (params = {}) => {
    return await api.get('/admin/viewings', { params });
  },

  updateViewingStatus: async (id, status) => {
    return await api.patch(`/admin/viewings/${id}/status`, { status });
  },

  rescheduleViewing: async (id, { date, time, notes = '' }) => {
    return await api.patch(`/admin/viewings/${id}/reschedule`, { date, time, notes });
  },

  // 9. Admin Notifications & Broadcasts
  getNotifications: async (params = {}) => {
    return await api.get('/admin/notifications', { params });
  },

  sendAnnouncement: async (payload) => {
    return await api.post('/admin/notifications', payload);
  },

  markNotificationRead: async (id) => {
    return await api.patch(`/admin/notifications/${id}/read`);
  },

  // 10. Analytics & Platform Settings
  getAnalytics: async () => {
    return await api.get('/admin/analytics');
  },

  getSettings: async () => {
    return await api.get('/admin/settings');
  },

  updateSettings: async (section, data) => {
    return await api.put('/admin/settings', { section, data });
  },
};
