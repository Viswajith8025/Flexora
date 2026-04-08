import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['Content-Type'] = 'application/json';
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
  register: (data) => api.post('/auth/register', {
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role === 'job_provider' ? 'provider' : 'user'
  }),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),

  // Jobs
  getJobs: (params) => api.get('/jobs', { params }),
  createJob: (data) => api.post('/jobs', data),
  applyToJob: (id) => api.post(`/jobs/apply/${id}`),
  applyForJob: (id) => api.post(`/jobs/apply/${id}`), // Alias for compatibility
  getMyApplications: () => api.get('/jobs/my-applications'),
  saveJob: (id) => api.post(`/jobs/save/${id}`),
  getSavedJobs: () => api.get('/jobs/saved'),
  reportJob: (id, reason) => api.post(`/jobs/report/${id}`, { reason }),

  // Chat
  getMessages: (jobId, userId) => api.get('/chat', { params: { jobId, withUserId: userId } }),
  sendMessage: (data) => api.post('/chat', data),

  // Admin
  getStats: () => api.get('/admin/stats'),
  getReportedJobs: () => api.get('/admin/reported-jobs'),
  flagJob: (id) => api.put(`/admin/flag-job/${id}`),
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAdminJobs: () => api.get('/admin/jobs'),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),

  // Provider Management
  getMyJobs: () => api.get('/jobs/my-jobs'),
  getProviderJobs: () => api.get('/jobs/provider/jobs'),
  updateApplicationStatus: (data) => api.put('/jobs/application/status', data)
};