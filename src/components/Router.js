import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from '../App'; // Main Todo App
import Auth from './Auth'; // Login/Register Component
import ProtectedRoute from './ProtectedRoute'; // Protects the main app route

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route: Login/Register */}
        <Route path="/auth" element={<Auth />} />

        {/* Protected Route: Main Todo App */}
        <Route path="/" element={<ProtectedRoute component={App} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
