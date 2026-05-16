import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AuthCallback from './pages/AuthCallback';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Admin from './pages/Admin';
import UserDashboard from './pages/UserDashboard';
import BecomeProvider from './pages/BecomeProvider';

import Navbar from './components/Navbar';

const Layout = ({ children }) => {
  const location = useLocation();
  const noNavPaths = ['/login', '/signup', '/forgot-password', '/reset-password'];
  const showNav = !noNavPaths.includes(location.pathname);

  return (
    <>
      {showNav && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/booking/:serviceId" element={<Booking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/become-provider" element={<BecomeProvider />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
