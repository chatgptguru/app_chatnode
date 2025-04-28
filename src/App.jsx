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
import AdminAnalytics from './admin/Analytics';
import ChatLogs from './admin/ChatLogs';
import AdminSettings from './admin/Settings';
import HelpSupport from './admin/HelpSupport';
import SubscriptionPlans from './components/SubscriptionPlans';
import AdminLogin from './admin/AdminLogin';
import ProtectedRoute from './admin/ProtectedRoute';
import PaymentSuccess from './components/PaymentSuccess';
import General from './settings/general';
import Models from './settings/models';
import Customize from './settings/customize';
import Prompts from './settings/prompts';
import Settings from './settings/index';
import Bot from './bot/Index';
import Team from './team/Index';
import Chats from './chats/Index';
import Data from './data/Index';
import Share from './share/index';
import Analytics from './analytics/index';
import Bots from './bots/Index';
import Chatbot from './chats/Chatbot';
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
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/chatbot/:botId" element={<div className='h-screen'><Chatbot /></div>} />
              <Route path="/" element={<Layout />} >
                <Route path="/" element={<Dashboard />} >
                  <Route path="bots" element={<Bots />} >
                  </Route>
                  <Route path="bot/:botId" element={<Bot />} >
                    <Route path="settings" element={<Settings />} >
                      <Route path="" element={<General />} />
                      <Route path="models" element={<Models />} />
                      <Route path="customize" element={<Customize />} />
                      <Route path="prompts" element={<Prompts />} />
                    </Route>
                    <Route path="chats" element={<Chats />} />
                    <Route path="data" element={<Data />} />
                    <Route path="share" element={<Share />} />
                    <Route path="analytics" element={<Analytics />} />
                  </Route>
                  <Route path="team" element={<Team />} />
                </Route>
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
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="chats" element={<ChatLogs />} />
                <Route path="settings" element={<AdminSettings />} />
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