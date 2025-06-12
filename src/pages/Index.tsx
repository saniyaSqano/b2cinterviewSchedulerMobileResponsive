
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Index = () => {
  const { user } = useUser();
  
  // Redirect based on user state
  if (user) {
    return <Navigate to="/levels" replace />;
  }
  
  return <Navigate to="/user" replace />;
};

export default Index;
