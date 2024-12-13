import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import Auth from './Auth';

function Router() {
  const isLoggedIn = !!localStorage.getItem('token'); // Check if token exists

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route for login/register */}
        <Route path="/auth" element={<Auth />} />

        {/* Protected route for the main app */}
        <Route
          path="/"
          element={isLoggedIn ? <App /> : <Navigate to="/auth" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
