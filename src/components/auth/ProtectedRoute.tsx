// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";


export function ProtectedRoute() {
  const {token } = useAuthStore();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
