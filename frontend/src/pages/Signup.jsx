import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, AlertCircle, CheckCircle2, ShieldCheck, RefreshCw, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // OTP States
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('/api/register', formData);
      if (response.data.require_otp) {
        setShowOtpScreen(true);
        setSuccess('OTP sent to your email!');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('/api/verify-registration-otp', {
        email: formData.email,
        otp: otp
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/resend-registration-otp', { email: formData.email });
      setSuccess('A new OTP has been sent to your email!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 relative overflow-hidden">
      
      {/* Subtle Background Animation */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 5, ease: "linear", repeat: Infinity }}
        style={{ backgroundSize: '200% 100%' }}
      />

      {/* Brand Logo Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="mb-8"
      >
        <Link to="/" className="flex items-center gap-2">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center"
          >
            <Sparkles className="text-white" size={24} />
          </motion.div>
          <span className="text-3xl font-black tracking-tight text-slate-900">ServiceHub</span>
        </Link>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[380px] w-full bg-white border border-gray-300 p-8 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300"
      >
        <motion.h1 variants={itemVariants} className="text-3xl font-normal text-slate-900 mb-6">
          {showOtpScreen ? 'Verify Email' : 'Create account'}
        </motion.h1>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 bg-red-50 text-red-700 rounded text-sm border border-red-200 flex items-start gap-2">
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 bg-green-50 text-green-700 rounded text-sm border border-green-200 flex items-start gap-2">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-600" />
                <span>{success}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!showOtpScreen ? (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-bold text-slate-900 mb-1">Your name</label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-gray-400 rounded focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all text-slate-900"
                    placeholder="First and last name"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-bold text-slate-900 mb-1">Email</label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-gray-400 rounded focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all text-slate-900"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-bold text-slate-900 mb-1">Mobile number</label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-gray-400 rounded focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all text-slate-900"
                    placeholder="Mobile number"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-bold text-slate-900 mb-1">Password</label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-gray-400 rounded focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all text-slate-900"
                    placeholder="At least 6 characters"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-[#F6C644] hover:bg-[#F3B822] text-slate-900 font-medium rounded shadow-sm border border-[#E2B133] transition-colors mt-2 flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {loading ? 'Processing...' : 'Verify email address'}
                  </motion.button>
                </motion.div>
              </form>

              <motion.div variants={itemVariants} className="mt-6">
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  By creating an account, you agree to ServiceHub's <a href="#" className="text-indigo-600 hover:underline">Conditions of Use</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Notice</a>.
                </p>
                
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                  <div className="relative bg-white px-2 text-xs text-slate-500">Or sign up with</div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#f9fafb' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = 'http://localhost:8000/api/auth/google'}
                  type="button"
                  className="mt-4 w-full py-2 bg-white border border-gray-300 text-slate-700 font-medium rounded shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </motion.button>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-8 pt-4 border-t border-gray-200">
                <p className="text-sm text-slate-800">
                  Already have an account?{' '}
                  <Link to="/login" className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium">Sign in</Link>
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm text-slate-800 mb-4">
                To verify your email, we've sent a One Time Password (OTP) to <span className="font-bold">{formData.email}</span>
              </p>
              
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-bold text-slate-900">Enter OTP</label>
                    <button 
                      type="button" 
                      onClick={handleResendOtp}
                      disabled={resending}
                      className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 disabled:opacity-50 disabled:hover:no-underline"
                    >
                      <RefreshCw size={12} className={resending ? "animate-spin" : ""} />
                      {resending ? 'Resending...' : 'Resend code'}
                    </button>
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-400 rounded focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all tracking-widest font-mono text-center text-lg"
                    placeholder="------"
                    maxLength={6}
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-[#F6C644] hover:bg-[#F3B822] text-slate-900 font-medium rounded shadow-sm border border-[#E2B133] transition-colors mt-2 flex justify-center items-center gap-2 disabled:opacity-70"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? 'Verifying...' : 'Create your ServiceHub account'}
                </motion.button>
                
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setShowOtpScreen(false)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    Change email address
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 border-t border-gray-200 w-full flex justify-center pt-8 shadow-[0_-1px_0_rgba(0,0,0,0.05)] bg-gradient-to-b from-white to-gray-50 pb-8"
      >
        <div className="flex gap-6 text-xs text-indigo-600 font-medium">
          <a href="#" className="hover:underline">Conditions of Use</a>
          <a href="#" className="hover:underline">Privacy Notice</a>
          <a href="#" className="hover:underline">Help</a>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
