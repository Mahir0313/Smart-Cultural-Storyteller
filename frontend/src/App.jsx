import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StoryProvider } from './context/StoryContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/common/MainLayout';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <StoryProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/category/:categoryId" element={<CategoryDetailPage />} />
            </Route>
          </Route>
        </Routes>
      </StoryProvider>
    </AuthProvider>
  );
}

export default App;
