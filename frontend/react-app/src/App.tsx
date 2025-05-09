// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginSignup from './Auth/LoginSignup';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import NotFound from './NotFound/NotFound';
import About from './About/About';
import Home from './Home/Home';
import Admin from './Admin/Admin';
import Lab from './Lab/Lab';
import Paths from './Paths/Paths';
import Account from './Account/Account';
import LessonView from './Lesson/LessonView';
import LessonEditor from './Lesson/LessonEditor';
import LessonCreate from './Lesson/LessonCreate';
import ResetPassword from './Auth/ResetPassword';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<LoginSignup />} />
        <Route path="/" element={<About />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/labs" element={<Lab />} />
          <Route path="/paths" element={<Paths />} />
          <Route path="/account" element={<Account />} />
          <Route path="/lesson/:lessonId/:pageNumber" element={<LessonView />} />
        </Route>
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/lesson/:lessonId" element={<LessonEditor />} />
          <Route path="/admin/lesson/new" element={<LessonCreate />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;