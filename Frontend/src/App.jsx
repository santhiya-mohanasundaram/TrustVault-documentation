import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// User Dashboard Layout & Pages
import UserLayout from './components/user/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import MyDocuments from './pages/user/MyDocuments';
import UploadDocument from './pages/user/UploadDocument';
import CategoriesPage from './pages/user/CategoriesPage';
import ExpiryCalendar from './pages/user/ExpiryCalendar';
import NotificationsPage from './pages/user/NotificationsPage';
import DocumentHistory from './pages/user/DocumentHistory';
import ProfilePage from './pages/user/ProfilePage';
import SettingsPage from './pages/user/SettingsPage';

// Admin Dashboard Layout & Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserManagement from './pages/admin/AdminUserManagement';
import AdminDocumentStats from './pages/admin/AdminDocumentStats';
import AdminCategoryManagement from './pages/admin/AdminCategoryManagement';
import AdminActivityMonitoring from './pages/admin/AdminActivityMonitoring';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Authentication */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* User Dashboard Section (Completely Independent) */}
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<Navigate to="/user/dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="documents" element={<MyDocuments />} />
            <Route path="upload" element={<UploadDocument />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="calendar" element={<ExpiryCalendar />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="history" element={<DocumentHistory />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Admin Dashboard Section (Completely Independent) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUserManagement />} />
            <Route path="statistics" element={<AdminDocumentStats />} />
            <Route path="categories" element={<AdminCategoryManagement />} />
            <Route path="activity" element={<AdminActivityMonitoring />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
