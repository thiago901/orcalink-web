import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";


export function CustomRoute():React.ReactElement {
   const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return  <Outlet />;
}
