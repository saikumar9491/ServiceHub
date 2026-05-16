import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <Sparkles size={24} />
          </div>
          <span className="text-xl font-bold text-slate-900">ServiceHub</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/services" className="text-slate-600 font-medium hover:text-indigo-600 transition-colors">Find Services</Link>
          <Link to="/become-provider" className="text-slate-600 font-medium hover:text-indigo-600 transition-colors">Become a Provider</Link>
          <a href="#" className="text-slate-600 font-medium hover:text-indigo-600 transition-colors">Help</a>
        </div>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-24 h-10 bg-slate-100 rounded-xl animate-pulse"></div>
          ) : user ? (
            <div 
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-xl transition-all group">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                  <User size={18} />
                </div>
                <span className="text-slate-700 font-semibold hidden sm:inline">{user.name}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-indigo-100/50 p-2 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</p>
                      <p className="text-sm font-semibold text-slate-700 truncate">{user.email}</p>
                    </div>

                    <Link 
                      to="/dashboard" 
                      className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                    >
                      <User size={18} />
                      <span className="font-medium">My Dashboard</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                      >
                        <LayoutDashboard size={18} />
                        <span className="font-medium">Admin Dashboard</span>
                      </Link>
                    )}

                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <LogOut size={18} />
                      <span className="font-medium">Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="px-6 py-2.5 text-slate-700 font-bold hover:bg-slate-50 rounded-xl transition-all">Log In</Link>
              <Link to="/signup" className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
