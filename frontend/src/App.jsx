import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login    from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers     from './pages/admin/AdminUsers';
import AdminStores    from './pages/admin/AdminStores';

import StoresList from './pages/user/StoresList';

import OwnerDashboard from './pages/owner/OwnerDashboard';

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin')       return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'store_owner') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/stores" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<RoleRedirect />} />

      <Route path="/admin/dashboard" element={
        <ProtectedRoute roles={['admin']}>
          <Layout><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute roles={['admin']}>
          <Layout><AdminUsers /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/stores" element={
        <ProtectedRoute roles={['admin']}>
          <Layout><AdminStores /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/stores" element={
        <ProtectedRoute>
          <Layout><StoresList /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/owner/dashboard" element={
        <ProtectedRoute roles={['store_owner']}>
          <Layout><OwnerDashboard /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout><Settings /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/unauthorized" element={
        <div className="min-h-screen bg-[#F1FBFF] flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-5xl font-bold text-[#8A2B3E] mb-3 font-[var(--font-display)]">403</p>
            <p className="text-[#52697A] mb-4">You don't have permission to access this page.</p>
            <a href="/" className="text-[#8A2B3E] font-semibold hover:underline">Go home</a>
          </div>
        </div>
      } />

      <Route path="*" element={
        <div className="min-h-screen bg-[#F1FBFF] flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-5xl font-bold text-[#B85B72] mb-3 font-[var(--font-display)]">404</p>
            <p className="text-[#52697A] mb-4">Page not found.</p>
            <a href="/" className="text-[#8A2B3E] font-semibold hover:underline">Go home</a>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#1A2530',
              border: '1px solid #D6E8EE',
              borderRadius: '12px',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 16px rgba(26,37,48,0.08)',
            },
            success: { iconTheme: { primary: '#1F7A55', secondary: '#FFFFFF' } },
            error:   { iconTheme: { primary: '#C0392B', secondary: '#FFFFFF' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
