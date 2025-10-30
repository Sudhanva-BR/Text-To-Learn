import axios from 'axios';

// Read from environment variable, fallback to Render URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://text-to-learn-klnl.onrender.com/api';

console.log('🔗 API Base URL:', API_BASE_URL); // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,  // Already includes /api, don't add it again
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 second timeout for Render cold starts
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - Render backend may be waking up');
    }
    return Promise.reject(error);
  }
);

// API methods
export const courseAPI = {
  getAllCourses: () => api.get('/courses/'),
  getCourse: (id) => api.get(`/courses/${id}/`),
  createCourse: (data) => api.post('/courses/', data),
  deleteCourse: (id) => api.delete(`/courses/${id}/`),
  generateCourse: (topic) => api.post('/generate-course/', { topic }),
  generateFullCourse: (topic) => api.post('/generate-full-course/', { topic }),
  generateLessonContent: (lessonId) => api.post(`/lessons/${lessonId}/generate-content/`),
};

export default api;