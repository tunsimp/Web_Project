import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import authService from '../services/authService';

interface ProtectedRouteProps {
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const [auth, setAuth] = useState<boolean | null>(null); // null = loading, true = authenticated, false = unauthenticated
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const data = await authService.checkAuth();
        if (data.message === "authenticated") {
          setAuth(true);
          setUserRole(data.user.role);
        } else {
          setAuth(false);
        }
      } catch (error) {
        setAuth(false);
      }
    };
    fetchAuth();
  }, []);

  if (auth === null) {
    return <div>Loading...</div>; // Show loading state while checking auth
  }

  if (!auth) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/home" replace />; // Redirect to home if role doesn't match
  }

  return <Outlet />;
};

export default ProtectedRoute;