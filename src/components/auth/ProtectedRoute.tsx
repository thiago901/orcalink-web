import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated,user } = useAuthStore();
  const location = useLocation();
  
  
  // if (!user) {
  //   // Redirect to login page with the return url
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }
  // else if (!!user && !user.active){
  //   return <Navigate to="/email-not-verified" replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;