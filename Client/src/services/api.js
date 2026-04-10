import axios from 'axios';

let baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Auto-fix if /api is missing in deployment
if (baseUrl && !baseUrl.includes('/api') && baseUrl.includes('onrender.com')) {
  baseUrl = baseUrl.endsWith('/') ? `${baseUrl}api` : `${baseUrl}/api`;
}

export const BACKEND_URL = baseUrl.replace('/api', '');

const api = axios.create({
  baseURL: baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/flexoraauth';
    }
    return Promise.reject(error);
  }
);

export default {
  // Auth
  register: (data) => api.post('auth/register', {
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role
  }),
  login: (credentials) => api.post('auth/login', credentials),
  getCurrentUser: () => api.get('auth/me'),
  updateProfile: (data) => api.patch('auth/update-profile', data),

  // Jobs
  getJobs: (params) => api.get('jobs', { params }),
  getPublicStats: () => api.get('jobs/stats'),
  createJob: (data) => api.post('jobs', data),
  applyToJob: (id) => api.post(`jobs/apply/${id}`),
  applyForJob: (id) => api.post(`jobs/apply/${id}`), 
  getMyApplications: () => api.get('applications/my'),

  // Applicant Management
  getJobApplicants: (id) => api.get(`jobs/${id}/applicants`),
  updateApplicantStatus: (jobId, userId, status) => api.patch(`jobs/${jobId}/applicants/${userId}/status`, { status }),
  saveJob: (id) => api.post(`jobs/save/${id}`),
  getSavedJobs: () => api.get('jobs/saved'),
  reportJob: (id, reason) => api.post(`jobs/report/${id}`, { reason }),

  // Payments
  createPaymentOrder: (jobId) => api.post("payment/create-order", { jobId }),
  verifyPayment: (paymentData) => api.post("payment/verify", paymentData),

  // Chat
  getMessages: (jobId, userId) => api.get('chat', { params: { jobId, withUserId: userId } }),
  sendMessage: (data) => api.post('chat', data),

  // Admin
  getStats: () => api.get('admin/stats'),
  getAdminStats: () => api.get('admin/stats'),
  getReportedJobs: () => api.get('admin/reported-jobs'),
  flagJob: (id) => api.put(`admin/flag-job/${id}`),
  getAllUsers: () => api.get('admin/users'),           // All seekers + providers with activity
  getUsers: () => api.get('admin/users'),
  deleteUser: (id) => api.delete(`admin/users/${id}`),
  getAllAdminJobs: () => api.get('admin/all-jobs'),    // Every job on the platform
  getAdminJobs: () => api.get('admin/all-jobs'),
  deleteJob: (id) => api.delete(`admin/jobs/${id}`),
  getPendingJobs: () => api.get('admin/jobs/pending'),
  approveJob: (id) => api.patch(`admin/jobs/${id}/approve`),

  // Provider Management
  getMyJobs: () => api.get('jobs/my-jobs'),
  getProviderJobs: () => api.get('jobs/provider/jobs'),
  updateApplicationStatus: (jobId, userId, status) => api.patch(`jobs/${jobId}/applicants/${userId}/status`, { status }),

  // Notifications
  getNotifications: () => api.get('notifications'),
  markNotificationRead: (id) => api.patch(`notifications/${id}/read`),
  markAllNotificationsRead: () => api.post('notifications/read-all')
};