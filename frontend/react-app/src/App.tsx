import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginSignup from './LoginSignup/LoginSignup';
import Home from './Home/Home';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import NotFound from './NotFound/NotFound';
//import Admin from './Admin/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<LoginSignup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          {/* Add other protected routes here */}
        </Route>
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;