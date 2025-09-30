import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ExamsPage from './components/ExamsPage';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import { getAuth } from './auth';

export default function App() {
  const navigate = useNavigate();
  const auth = getAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginForm onSuccess={() => navigate('/')} />} />
      <Route path="/" element={<ProtectedRoute><ExamsPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={auth ? '/' : '/login'} replace />} />
    </Routes>
  );
}