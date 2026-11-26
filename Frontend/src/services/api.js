import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tv_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401 if unauthorized
      const currentToken = localStorage.getItem('tv_token');
      if (currentToken && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('tv_token');
        localStorage.removeItem('tv_user');
      }
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authApi = {
  login: async (email, password, role) => {
    const res = await api.post('/auth/login', { email, password, role });
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {}
    localStorage.removeItem('tv_token');
    localStorage.removeItem('tv_user');
    localStorage.removeItem('tv_role');
  }
};

// Document APIs
export const documentApi = {
  getAll: async (params = {}) => {
    const res = await api.get('/documents', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/documents/${id}`);
    return res.data;
  },
  upload: async (formData) => {
    const res = await api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/documents/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/documents/${id}`);
    return res.data;
  },
  getDownloadUrl: (id) => `${API_BASE_URL}/documents/${id}/download`,
  getPreviewUrl: (id) => `${API_BASE_URL}/documents/${id}/preview`,
  downloadFile: async (id, fileName) => {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName || 'document');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};

// Category APIs
export const categoryApi = {
  getAll: async () => {
    const res = await api.get('/categories');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/categories', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/categories/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  }
};

// Notification APIs
export const notificationApi = {
  getAll: async () => {
    const res = await api.get('/notifications');
    return res.data;
  },
  markRead: async (id) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  },
  markAllRead: async () => {
    const res = await api.patch('/notifications/read-all');
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  },
  clearAll: async () => {
    const res = await api.delete('/notifications/clear-all');
    return res.data;
  }
};

// Activity Logs APIs
export const activityApi = {
  getUserActivities: async () => {
    const res = await api.get('/activities');
    return res.data;
  },
  getSystemLogs: async () => {
    const res = await api.get('/activities/system');
    return res.data;
  }
};

// User Profile & Settings APIs
export const userApi = {
  getProfile: async () => {
    const res = await api.get('/users/profile');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put('/users/profile', data);
    return res.data;
  },
  changePassword: async (data) => {
    const res = await api.post('/users/change-password', data);
    return res.data;
  },
  getDashboardStats: async () => {
    const res = await api.get('/dashboard/stats');
    return res.data;
  }
};

// Admin Console APIs
export const adminApi = {
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },
  getUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },
  updateUserStatus: async (id, status) => {
    const res = await api.patch(`/admin/users/${id}/status`, { status });
    return res.data;
  }
};

// Expiry Reminder Scheduler APIs
export const schedulerApi = {
  triggerExpiryAudit: async () => {
    const res = await api.post('/scheduler/check-expiry');
    return res.data;
  }
};

export default api;
