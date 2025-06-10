
import React from 'react';
import { useUser } from '../contexts/UserContext';
import UserInfoForm from './UserInfoForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useUser();

  if (!isLoggedIn) {
    return <UserInfoForm />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
