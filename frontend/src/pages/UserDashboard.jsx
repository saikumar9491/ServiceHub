import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Search, ChevronRight, User, CreditCard, Shield, Settings, HelpCircle, Star, Sparkles, LogOut, ArrowRight, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      // In a real scenario, this fetches from the backend
      const response = await axios.get('/api/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      // Dummy data for visual representation if backend fails/is empty
      setBookings([
        {
          id: 1,
          service: { service_name: 'Premium Home Cleaning', category: 'Cleaning', price: 45.00 },
          booking_date: '2026-05-20',
          slot_time: '10:00 AM',
          status: 'pending',
          provider: { name: 'Sarah Jenkins', rating: 4.8 }
        },
        {
          id: 2,
          service: { service_name: 'AC Repair & Servicing', category: 'Maintenance', price: 89.00 },
          booking_date: '2026-05-18',
          slot_time: '02:00 PM',
          status: 'completed',
          provider: { name: 'Mike Tech', rating: 4.9 }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (!user) return null;

  const upcomingBookings = bookings.filter(b => ['pending', 'accepted'].includes(b.status));
  const pastBookings = bookings.filter(b => ['completed', 'cancelled'].includes(b.status));

  const sidebarLinks = [
    { id: 'bookings', icon: Calendar, label: 'My Bookings' },
    { id: 'wallet', icon: CreditCard, label: 'Wallet & Payments' },
    { id: 'profile', icon: User, label: 'Manage Profile' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'support', icon: HelpCircle, label: 'Help & Support' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Account</h1>
            <p className="text-slate-500 mt-2 font-medium">Manage your bookings, profile, and settings</p>
          </div>
          <Link 
            to="/services" 
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            <Search size={18} />
            Find a Service
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg mt-1 w-fit">
                    <Activity size={14} />
                    <span>Active Member</span>
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                {sidebarLinks.map((link) => {
                  const isActive = activeTab === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => setActiveTab(link.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all ${
                        isActive 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <link.icon size={20} className={isActive ? 'text-indigo-400' : 'text-slate-400'} />
                      {link.label}
                      {isActive && <ChevronRight size={16} className="ml-auto opacity-50" />}
                    </button>
                  );
                })}
              </nav>
            </div>
            
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 bg-white text-red-600 font-bold py-4 rounded-2xl border border-red-100 shadow-sm hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === 'bookings' && (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Upcoming Bookings */}
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <Sparkles className="text-indigo-600" />
                        Upcoming Services
                      </h3>
                    </div>
                    
                    {isLoading ? (
                      <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      </div>
                    ) : upcomingBookings.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        {upcomingBookings.map((booking) => (
                          <div key={booking.id} className="group border border-slate-100 bg-slate-50 rounded-[2rem] p-6 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                            
                            <div className="flex justify-between items-start mb-6">
                              <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </div>
                              <span className="text-indigo-600 font-black text-xl">${booking.service?.price}</span>
                            </div>

                            <h4 className="text-lg font-bold text-slate-900 mb-4 pr-10 leading-tight">
                              {booking.service?.service_name}
                            </h4>

                            <div className="space-y-3 mb-6">
                              <div className="flex items-center gap-3 text-slate-600 font-medium">
                                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-indigo-500">
                                  <Calendar size={16} />
                                </div>
                                {booking.booking_date}
                              </div>
                              <div className="flex items-center gap-3 text-slate-600 font-medium">
                                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-indigo-500">
                                  <Clock size={16} />
                                </div>
                                {booking.slot_time}
                              </div>
                            </div>
                            
                            <div className="pt-5 border-t border-slate-200/60 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold overflow-hidden">
                                  {booking.provider?.name ? booking.provider.name.charAt(0) : <User size={18} />}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900">{booking.provider?.name || 'Assigning Provider...'}</p>
                                  {booking.provider?.rating && (
                                    <div className="flex items-center text-xs font-bold text-amber-500">
                                      <Star size={12} className="fill-current mr-1" />
                                      {booking.provider.rating}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <button className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-colors">
                                <ArrowRight size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <Calendar className="mx-auto text-slate-300 mb-4" size={48} />
                        <h4 className="text-lg font-bold text-slate-900 mb-2">No upcoming bookings</h4>
                        <p className="text-slate-500 mb-6 max-w-sm mx-auto">You don't have any upcoming services scheduled at the moment.</p>
                        <Link to="/services" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors">
                          Find Services
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Past Bookings */}
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Past Services</h3>
                    
                    {pastBookings.length > 0 ? (
                      <div className="space-y-4">
                        {pastBookings.map((booking) => (
                          <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl border border-slate-100 hover:border-slate-300 transition-colors">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 flex-shrink-0">
                              <MapPin size={20} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-900">{booking.service?.service_name}</h4>
                              <p className="text-sm font-medium text-slate-500">{booking.booking_date} • {booking.slot_time}</p>
                            </div>
                            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                              <span className="font-black text-slate-900">${booking.service?.price}</span>
                              <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 font-medium py-4">No past booking history found.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Dummy Placeholders for other tabs */}
              {activeTab !== 'bookings' && (
                <motion.div
                  key="other"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-[2.5rem] p-16 shadow-sm border border-slate-100 text-center"
                >
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                    <Settings size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Coming Soon</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    The {sidebarLinks.find(l => l.id === activeTab)?.label} section is currently under development. Please check back later.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
