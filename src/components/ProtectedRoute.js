import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ component: Component }) {
  const token = localStorage.getItem('token');

  // Placeholder for token validation logic
  const isValidToken = !!token; // Simplified: You can add token expiration checks here

  return isValidToken ? <Component /> : <Navigate to="/auth" />;
}

export default ProtectedRoute;
