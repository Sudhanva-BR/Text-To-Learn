import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API methods
export const courseAPI = {
  // Get all courses
  getAllCourses: () => api.get('/courses/'),
  
  // Get single course with modules and lessons
  getCourse: (id) => api.get(`/courses/${id}/`),
  
  // Create new course
  createCourse: (data) => api.post('/courses/', data),
  
  // Delete course
  deleteCourse: (id) => api.delete(`/courses/${id}/`),
  
  // Generate course from topic (AI)
  generateCourse: (topic) => api.post('/generate-course/', { topic }),
  
  // Generate full course with all lessons (AI)
  generateFullCourse: (topic) => api.post('/generate-full-course/', { topic }),
  
  // Generate lesson content (AI)
  generateLessonContent: (lessonId) => api.post(`/lessons/${lessonId}/generate-content/`),
};

export default api;