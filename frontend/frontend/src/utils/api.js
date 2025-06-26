import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  validate: (token) => api.get(`/auth/validate?token=${token}`),
};

// Student API
export const studentAPI = {
  updateProfile: (data) => api.post('/students/profile', data),
  getProfile: (email) => api.get(`/students/profile/${email}`),
};

// Recruiter API
export const recruiterAPI = {
  updateProfile: (data) => api.post('/recruiters/profile', data),
  getAll: () => api.get('/recruiters/all'),
  getByEmail: (email) => api.get(`/recruiters/${email}`),
};

// Job API
export const jobAPI = {
  postJob: (data) => api.post('/jobs/post', data),
  updateJob: (jobId, data) => api.put(`/jobs/${jobId}`, data),
  deleteJob: (jobId) => api.delete(`/jobs/${jobId}`),
  getJobsByRecruiter: () => api.get('/jobs/recruiter'),
  getAllJobs: () => api.get('/jobs/all'),
  searchJobs: (query) => api.get(`/jobs/search?query=${encodeURIComponent(query)}`),
  applyForJob: (data) => api.post('/jobs/apply', data),
  getApplicationsByJob: (jobId) => api.get(`/jobs/applications/${jobId}`),
  getApplicationsByStudent: () => api.get('/jobs/applications/student'),
  updateApplicationStatus: (applicationId, status) => 
    api.put(`/jobs/applications/${applicationId}/status`, { status }),
};

export default api; 