import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreateCourse from './pages/CreateCourse';
import MyCourses from './pages/MyCourses';
import CourseView from './pages/CourseView';
import LessonView from './pages/LessonView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="create" element={<CreateCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="course/:courseId" element={<CourseView />} />
          <Route path="course/:courseId/module/:moduleIndex/lesson/:lessonIndex" element={<LessonView />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;