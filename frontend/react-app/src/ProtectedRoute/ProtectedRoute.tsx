// components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

interface ProtectedRouteProps {
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const [auth, setAuth] = useState<boolean | null>(null); // null = loading, true = authenticated, false = unauthenticated
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/check-auth", { withCredentials: true })
      .then((res) => {
        if (res.data.message === "authenticated") {
          setAuth(true);
          setUserRole(res.data.user.role); // Assuming the user object has a role field
        } else {
          setAuth(false);
        }
      })
      .catch(() => setAuth(false));
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