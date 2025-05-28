
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

const ProtectedRoute = ({ children , allowedRoles = [] }) => {
  const { token ,user} = useContext(AuthContext);
 
 /* if (!user || !user.token) return <Navigate to="/login" replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
  */
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
