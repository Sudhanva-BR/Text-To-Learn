import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreateCourse from './pages/CreateCourse';
import MyCourses from './pages/MyCourses';
import CourseView from './pages/CourseView';
import LessonView from './pages/LessonView';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
      
      {/* Protected routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="create" element={<ProtectedRoute><CreateCourse /></ProtectedRoute>} />
        <Route path="my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
        <Route path="course/:courseId" element={<ProtectedRoute><CourseView /></ProtectedRoute>} />
        <Route path="course/:courseId/module/:moduleIndex/lesson/:lessonIndex" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;