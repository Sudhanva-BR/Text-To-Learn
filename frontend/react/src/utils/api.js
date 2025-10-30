import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://text-to-learn-klnl.onrender.com';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
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
