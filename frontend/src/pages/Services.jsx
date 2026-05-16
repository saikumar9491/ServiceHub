import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Star, Clock, MapPin, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const categories = [
  'All', 'Electrician', 'Plumbing', 'Cleaning', 'AC Repair', 'Painting', 'Gardening'
];

const Services = () => {
  const location = useLocation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Parse URL parameters
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    fetchServices();
  }, [location.search]);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/services');
      setServices(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      // Fallback dummy data if API fails or is empty
      setServices([
        { id: 1, service_name: 'Premium House Cleaning', category: 'Cleaning', price: 49.99, rating: 4.8, reviews_count: 124, image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400' },
        { id: 2, service_name: 'Professional Electrician', category: 'Electrician', price: 35.00, rating: 4.9, reviews_count: 89, image_url: 'https://images.unsplash.com/photo-1621905252507-b354bc2d18c4?auto=format&fit=crop&q=80&w=400' },
        { id: 3, service_name: 'Expert Plumbing Repair', category: 'Plumbing', price: 40.00, rating: 4.7, reviews_count: 56, image_url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=400' },
        { id: 4, service_name: 'AC Deep Cleaning', category: 'AC Repair', price: 55.00, rating: 4.6, reviews_count: 210, image_url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=400' },
      ]);
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch = service.service_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
      <div className="container mx-auto px-6">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Explore Services</h1>
            <p className="text-slate-500">Find the right expert for your home needs</p>
          </div>
          
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for services..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-8">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-between group ${
                      selectedCategory === cat 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                      : 'text-slate-600 hover:bg-white hover:text-indigo-600'
                    }`}
                  >
                    {cat}
                    <ChevronRight size={16} className={`${selectedCategory === cat ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
              <Sparkles className="absolute -top-2 -right-2 text-indigo-400 opacity-30" size={80} />
              <h4 className="font-bold mb-2">Need Help?</h4>
              <p className="text-xs text-indigo-100 mb-4 leading-relaxed">Chat with our experts to find the right service for you.</p>
              <button className="w-full py-2.5 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                Contact Support
              </button>
            </div>
          </aside>

          {/* Service Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-96 bg-slate-200 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredServices.map((service, i) => (
                    <motion.div
                      key={service._id || service.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.05 }}
                      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all flex flex-col sm:flex-row"
                    >
                      <div className="relative w-full sm:w-48 sm:min-w-[12rem] h-48 sm:h-auto bg-slate-100 flex items-center justify-center shrink-0">
                        {service.image_url ? (
                          <img 
                            src={service.image_url} 
                            alt={service.service_name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        
                        {/* Fallback Icon if image fails or is missing */}
                        <div className={`w-full h-full flex flex-col items-center justify-center text-slate-300 ${service.image_url ? 'hidden' : 'flex'}`}>
                          <Sparkles size={40} className="mb-2 opacity-50" />
                          <span className="text-xs font-bold uppercase tracking-wider">ServiceHub</span>
                        </div>

                        <div className="absolute top-4 left-4 sm:hidden px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-bold text-indigo-600 shadow-sm">
                          {service.category}
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-center relative">
                        <div className="absolute top-6 right-6 hidden sm:flex px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold tracking-wide">
                          {service.category}
                        </div>

                        <div className="flex justify-between items-start mb-2 sm:pr-24">
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                            {service.service_name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-4 mb-4 text-sm text-slate-500 font-medium">
                          <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-md">
                            <Star size={14} className="text-amber-500 fill-amber-500" />
                            <span className="text-slate-900 font-bold">{service.rating || 'New'}</span>
                            {service.reviews_count > 0 && <span className="opacity-60">({service.reviews_count})</span>}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Clock size={14} />
                            <span>60 min</span>
                          </div>
                        </div>
                        
                        <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                          {service.description || "Professional and highly rated service expert available for your home needs. Book now for instant confirmation."}
                        </p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                          <div>
                            <p className="text-sm text-slate-400 font-medium">Starting from</p>
                            <p className="text-2xl font-black text-slate-900">₹{service.price}</p>
                          </div>
                          
                          <Link 
                            to={`/booking/${service._id || service.id}`}
                            className="px-6 py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center gap-2"
                          >
                            Book Now
                            <ChevronRight size={18} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Services;
