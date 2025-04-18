import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginSignup from './LoginSignup/LoginSignup';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import NotFound from './NotFound/NotFound';
import About from './About/About';
import Home from './Home/Home';
//import Admin from './Admin/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<LoginSignup />} />
        <Route path="/" element={<About/>}/>
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/lab" element={<Home />} />
          <Route path="/paths" element={<Home />} />
          <Route path="/admin" element={<Home />} />
          <Route path="/account" element={<Home />} />
          {/* Add other protected routes here */}
        </Route>
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;