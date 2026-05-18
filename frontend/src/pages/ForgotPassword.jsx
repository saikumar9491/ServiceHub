import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post('/api/forgot-password', { email });
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.1 }
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
        <motion.h1 variants={itemVariants} className="text-3xl font-normal text-slate-900 mb-2">Password assistance</motion.h1>
        <motion.p variants={itemVariants} className="text-sm text-slate-700 mb-6">Enter the email address associated with your ServiceHub account.</motion.p>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-bold text-slate-900 mb-1">Email</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-400 rounded focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all text-slate-900"
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
              {loading ? 'Sending OTP...' : 'Continue'}
            </motion.button>
          </motion.div>
        </form>

      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="max-w-[380px] w-full mt-6"
      >
        <div className="mt-4 pt-4 text-center">
          <p className="text-sm text-slate-800">
            Has your email address changed?{' '}
          </p>
          <p className="text-sm text-slate-600 mt-1">
            If you no longer use the email address associated with your ServiceHub account, you may contact <a href="#" className="text-indigo-600 hover:text-indigo-800 hover:underline">Customer Service</a> for help restoring access to your account.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
            Return to sign in
          </Link>
        </div>
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

export default ForgotPassword;
