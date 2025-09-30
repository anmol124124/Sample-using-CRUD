import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from '../auth';

export default function ProtectedRoute({ children }) {
  const auth = getAuth();
  if (!auth) return <Navigate to="/login" replace />;
  return <>{children}</>;
}