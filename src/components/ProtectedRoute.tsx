
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useUser();

  if (!isLoggedIn) {
    return <Navigate to="/user-info" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
