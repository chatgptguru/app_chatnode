import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './auth/SingIn';
import Dashboard from './Dashboard';
import NotFound from './Notfound';
import Layout from './Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './AuthContext'; // Adjust the import path as necessary
import SignUp from './auth/Signup';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import { store } from './store';
import AdminLayout from './admin/Layout';
import AdminDashboard from './admin/Dashboard';
import UsersManagement from './admin/UsersManagement';
import ModelsManagement from './admin/ModelsManagement';
import SubscriptionsManagement from './admin/SubscriptionsManagement';
import Analytics from './admin/Analytics';
import ChatLogs from './admin/ChatLogs';
import Settings from './admin/Settings';
import HelpSupport from './admin/HelpSupport';
import SubscriptionPlans from './components/SubscriptionPlans';
import AdminLogin from './admin/AdminLogin';
import ProtectedRoute from './admin/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <BrowserRouter>
            <ToastContainer />
            <Routes>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/subscription-plans" element={<SubscriptionPlans />} />
              <Route path="/" element={<Layout />} >
                <Route path="/" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UsersManagement />} />
                <Route path="models" element={<ModelsManagement />} />
                <Route path="subscriptions" element={<SubscriptionsManagement />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="chats" element={<ChatLogs />} />
                <Route path="settings" element={<Settings />} />
                <Route path="help" element={<HelpSupport />} />
              </Route>
            </Routes>
          </BrowserRouter >
        </AuthProvider>
      </GoogleOAuthProvider >
    </Provider >
  )
}

export default App