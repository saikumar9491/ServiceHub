import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Building, Clock, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BecomeProvider = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    business_name: '',
    service_category: 'Electrician',
    experience_years: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Electrician', 'Plumbing', 'Cleaning', 'AC Repair', 'Painting', 'Gardening'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'provider' || user.role === 'admin') {
      setError('You are already registered as a provider or admin.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await axios.post('/api/provider-requests', formData);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || JSON.stringify(err);
      setError(`Error: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex flex-col items-center justify-center text-center px-6">
        <Briefcase size={64} className="text-indigo-300 mb-6" />
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Partner with ServiceHub</h1>
        <p className="text-slate-500 max-w-md mb-8">You must be logged into your account to apply to become a service provider.</p>
        <button onClick={() => navigate('/login')} className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all">
          Log In or Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl mb-6">
                  <Briefcase size={32} />
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Become a Provider</h1>
                <p className="text-lg text-slate-500">Join our network of elite professionals and grow your business.</p>
              </div>

              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                {error && (
                  <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 border border-red-100">
                    <AlertCircle size={20} />
                    <p className="font-semibold">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Business Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Business / Individual Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building className="text-slate-400" size={20} />
                      </div>
                      <input 
                        type="text" 
                        required
                        value={formData.business_name}
                        onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                        placeholder="E.g., John's Plumbing Services" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Service Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Primary Service Category</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Briefcase className="text-slate-400" size={20} />
                      </div>
                      <select 
                        value={formData.service_category}
                        onChange={(e) => setFormData({...formData, service_category: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all appearance-none"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Years of Experience</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Clock className="text-slate-400" size={20} />
                      </div>
                      <input 
                        type="number" 
                        required
                        min="0"
                        max="50"
                        value={formData.experience_years}
                        onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                        placeholder="E.g., 5" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>Submit Application <ChevronRight size={20} /></>
                      )}
                    </button>
                    <p className="text-center text-slate-400 text-sm mt-4 font-medium">By submitting, you agree to our terms and background check policy.</p>
                  </div>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-12 md:p-16 rounded-[3rem] border border-slate-100 shadow-xl text-center"
            >
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Application Received!</h2>
              <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                Thank you for applying to join ServiceHub! Our administrative team will review your application and get back to you shortly.
              </p>
              <button 
                onClick={() => navigate('/dashboard')} 
                className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BecomeProvider;
