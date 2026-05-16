import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Calendar, Briefcase, TrendingUp, IndianRupee, Search, ShieldAlert, CheckCircle, XCircle, Mail, Trash2, Lock, Unlock, LayoutDashboard, UserCog, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'providers'

  const [stats, setStats] = useState({
    users: 124,
    bookings: 45,
    services: 12,
    revenue: 1240.50
  });

  const [providerRequests, setProviderRequests] = useState([]);
  const [usersList, setUsersList] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add Service Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmittingService, setIsSubmittingService] = useState(false);
  const [newService, setNewService] = useState({
    service_name: '',
    category: 'Plumber',
    price: '',
    description: '',
    image_url: '',
    provider_id: ''
  });

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      
      const [requestsRes, usersRes, statsRes] = await Promise.all([
        axios.get('/api/admin/provider-requests', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setProviderRequests(Array.isArray(requestsRes.data) ? requestsRes.data : []);
      setUsersList(Array.isArray(usersRes.data) ? usersRes.data : []);
      if (statsRes.data) {
        setStats(statsRes.data);
      }
      
    } catch (error) {
      console.error("Error fetching admin data", error);
      setError(error.response?.data?.message || error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleApprove = async (id) => {
    try {
      await axios.post(`/api/admin/provider-requests/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh all data to update users list as well
    } catch (error) {
      console.error("Error approving request", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`/api/admin/provider-requests/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error("Error rejecting request", error);
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      await axios.post(`/api/admin/users/${id}/toggle-block`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error("Error toggling block", error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this user/provider?')) {
      try {
        await axios.delete(`/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (error) {
        console.error("Error deleting user", error);
      }
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.provider_id) {
      alert("Please select a provider for this service.");
      return;
    }

    try {
      setIsSubmittingService(true);
      await axios.post('/api/services', newService, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAddModalOpen(false);
      setNewService({ service_name: '', category: 'Plumber', price: '', description: '', image_url: '', provider_id: '' });
      fetchData(); // Refresh stats
    } catch (error) {
      console.error("Error adding service", error);
      alert(error.response?.data?.message || "Failed to add service");
    } finally {
      setIsSubmittingService(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-slate-500 font-medium">Verifying access...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex flex-col items-center justify-center">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Access Denied</h1>
        <p className="text-slate-500">You do not have permission to view this page.</p>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Active Bookings', value: stats.bookings, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Total Services', value: stats.services, icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Total Revenue', value: `₹${stats.revenue}`, icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  const standardUsers = usersList.filter(u => u.role === 'user');
  
  // Include the current admin in the list of available providers, along with any approved providers
  const providers = [
    user, 
    ...usersList.filter(u => u.role === 'provider')
  ];

  const UserTable = ({ data, type }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-sm text-slate-400 uppercase tracking-wider">
            <th className="p-4 font-semibold">Name</th>
            <th className="p-4 font-semibold">Email</th>
            <th className="p-4 font-semibold">Status</th>
            <th className="p-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl">
                No {type}s found.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item._id || item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-bold text-slate-800">{item.name}</td>
                <td className="p-4 text-slate-500">{item.email}</td>
                <td className="p-4">
                  {item.is_blocked ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                      <Lock size={12} /> Blocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                      <CheckCircle size={12} /> Active
                    </span>
                  )}
                </td>
                <td className="p-4 flex items-center justify-end gap-2">
                  <a 
                    href={`mailto:${item.email}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Message"
                  >
                    <Mail size={18} />
                  </a>
                  <button 
                    onClick={() => handleToggleBlock(item._id || item.id)}
                    className={`p-2 rounded-xl transition-colors ${item.is_blocked ? 'text-emerald-600 hover:bg-emerald-50' : 'text-amber-600 hover:bg-amber-50'}`}
                    title={item.is_blocked ? 'Unblock User' : 'Block User'}
                  >
                    {item.is_blocked ? <Unlock size={18} /> : <Lock size={18} />}
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(item._id || item.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete Permanently"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20">
      <div className="container mx-auto px-6">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Manage your platform, users, and providers.</p>
          </div>
          
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto max-w-full">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <LayoutDashboard size={18} /> Overview
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Users size={18} /> Users
            </button>
            <button 
              onClick={() => setActiveTab('providers')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'providers' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <UserCog size={18} /> Providers
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 border border-red-100">
            <ShieldAlert size={20} />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Stats Grid - Only show on Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    Provider Applications
                    {providerRequests.filter(r => r.status === 'pending').length > 0 && (
                      <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                        {providerRequests.filter(r => r.status === 'pending').length} New
                      </span>
                    )}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {loading ? (
                    <p className="text-slate-500 text-center py-4">Loading requests...</p>
                  ) : providerRequests.length === 0 ? (
                    <p className="text-slate-500 text-center py-4 bg-slate-50 rounded-2xl">No provider applications found.</p>
                  ) : (
                    providerRequests.map((req) => (
                      <div key={req.id || req._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="mb-4 sm:mb-0">
                          <p className="font-bold text-slate-800">{req.business_name} <span className="text-slate-400 font-normal ml-2">({req.user?.name || 'Unknown User'})</span></p>
                          <p className="text-sm text-slate-500 mt-1">Category: <span className="font-semibold text-indigo-600">{req.service_category}</span> • Experience: {req.experience_years} years</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {req.status === 'pending' ? (
                            <>
                              <button 
                                onClick={() => handleReject(req.id || req._id)}
                                className="px-4 py-2 bg-white border border-rose-200 text-rose-600 font-bold rounded-xl hover:bg-rose-50 transition-all flex items-center gap-2"
                              >
                                <XCircle size={16} /> Reject
                              </button>
                              <button 
                                onClick={() => handleApprove(req.id || req._id)}
                                className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all flex items-center gap-2"
                              >
                                <CheckCircle size={16} /> Approve
                              </button>
                            </>
                          ) : (
                            <span className={`px-4 py-2 rounded-xl text-sm font-bold uppercase ${
                              req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}>
                              {req.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm h-fit">
                <h3 className="text-xl font-bold text-slate-900 mb-8">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={20} /> Add New Service
                  </button>
                  <button className="w-full py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all">Export Reports</button>
                  <button className="w-full py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all">Platform Settings</button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div 
              key="users"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <Users className="text-indigo-600" /> Manage Users
              </h3>
              {loading ? (
                <p className="text-slate-500 text-center py-8">Loading users...</p>
              ) : (
                <UserTable data={standardUsers} type="user" />
              )}
            </motion.div>
          )}

          {activeTab === 'providers' && (
            <motion.div 
              key="providers"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <UserCog className="text-indigo-600" /> Manage Providers
              </h3>
              {loading ? (
                <p className="text-slate-500 text-center py-8">Loading providers...</p>
              ) : (
                <UserTable data={providers} type="provider" />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Service Modal */}
        <AnimatePresence>
          {isAddModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-[2.5rem] p-8 w-full max-w-2xl shadow-2xl relative my-8"
              >
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
                >
                  <X size={24} />
                </button>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New Service</h2>
                
                <form onSubmit={handleAddService} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Service Name</label>
                      <input 
                        type="text" required
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="e.g. AC Repair"
                        value={newService.service_name}
                        onChange={(e) => setNewService({...newService, service_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                      <select 
                        required
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        value={newService.category}
                        onChange={(e) => setNewService({...newService, category: e.target.value})}
                      >
                        <option value="Plumber">Plumber</option>
                        <option value="Electrician">Electrician</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Carpentry">Carpentry</option>
                        <option value="Appliance Repair">Appliance Repair</option>
                        <option value="Painting">Painting</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Price (₹)</label>
                      <input 
                        type="number" required min="0" step="0.01"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="0.00"
                        value={newService.price}
                        onChange={(e) => setNewService({...newService, price: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Assign Provider</label>
                      <select 
                        required
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        value={newService.provider_id}
                        onChange={(e) => setNewService({...newService, provider_id: e.target.value})}
                      >
                        <option value="" disabled>Select a provider</option>
                        {providers.map(p => (
                          <option key={p._id || p.id} value={p._id || p.id}>{p.name} ({p.email})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Image URL (Optional)</label>
                    <input 
                      type="url"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      placeholder="https://example.com/image.jpg"
                      value={newService.image_url}
                      onChange={(e) => setNewService({...newService, image_url: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                    <textarea 
                      required rows="4"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      placeholder="Describe the service..."
                      value={newService.description}
                      onChange={(e) => setNewService({...newService, description: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmittingService}
                    className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 ${isSubmittingService ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'}`}
                  >
                    {isSubmittingService ? 'Adding Service...' : 'Publish Service'}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
