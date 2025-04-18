// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginSignup from './LoginSignup/LoginSignup';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import NotFound from './NotFound/NotFound';
import About from './About/About';
import Home from './Home/Home';
import Admin from './Admin/Admin';
import Lab from './Lab/Lab';
import Paths from './Paths/Paths';
import Account from './Account/Account';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<LoginSignup />} />
        <Route path="/" element={<About />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/lab" element={<Lab />} />
          <Route path="/paths" element={<Paths />} />
          <Route path="/account" element={<Account />} />
        </Route>
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;