// components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = () => {
  const [auth, setAuth] = useState<boolean | null>(null); // null = loading, true = authenticated, false = unauthenticated

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/route/home", { withCredentials: true })
      .then((res) => {
        if (res.data.message === "valid") {
          setAuth(true);
        } else {
          setAuth(false);
        }
      })
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) {
    return <div>Loading...</div>; // Show loading state while checking auth
  }

  return auth ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;