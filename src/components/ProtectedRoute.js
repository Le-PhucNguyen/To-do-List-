import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ component: Component }) {
  const token = localStorage.getItem('token'); // Retrieve the token
  return token ? <Component /> : <Navigate to="/auth" />;
}

export default ProtectedRoute;
