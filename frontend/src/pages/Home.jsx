import React, { useState } from 'react';
import { Search, MapPin, Sparkles, ShieldCheck, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const categories = [
  { id: 1, name: 'Electrician', icon: '⚡', color: 'bg-yellow-100 text-yellow-600' },
  { id: 2, name: 'Plumbing', icon: '💧', color: 'bg-blue-100 text-blue-600' },
  { id: 3, name: 'Cleaning', icon: '🧹', color: 'bg-purple-100 text-purple-600' },
  { id: 4, name: 'AC Repair', icon: '❄️', color: 'bg-cyan-100 text-cyan-600' },
  { id: 5, name: 'Painting', icon: '🎨', color: 'bg-pink-100 text-pink-600' },
  { id: 6, name: 'Gardening', icon: '🌿', color: 'bg-green-100 text-green-600' },
];

const Home = () => {
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-50/50 to-transparent -z-10" />
        
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-8"
            >
              <Sparkles size={16} />
              <span>Reliable services at your doorstep</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 leading-[1.1]"
            >
              Find and book the best <br />
              <span className="text-indigo-600">Local Services</span> easily
            </motion.h1>

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-2 rounded-3xl shadow-xl shadow-indigo-100 flex flex-col md:flex-row items-center gap-2 border border-slate-100"
            >
              <div className="flex-1 flex items-center gap-3 px-4 w-full">
                <MapPin className="text-indigo-500" size={20} />
                <input 
                  type="text" 
                  placeholder="Select location..." 
                  className="w-full py-3 bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400"
                />
              </div>
              <div className="hidden md:block w-px h-8 bg-slate-200" />
              <div className="flex-[1.5] flex items-center gap-3 px-4 w-full">
                <Search className="text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="What service are you looking for?" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full py-3 bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400"
                />
              </div>
              <Link 
                to={search ? `/services?search=${search}` : `/services`}
                className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-200 active:scale-95 flex items-center justify-center"
              >
                Find Services
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Popular Categories</h2>
              <p className="text-slate-500">Explore our most booked services</p>
            </div>
            <Link to="/services" className="text-indigo-600 font-semibold hover:underline decoration-2 underline-offset-4">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                onClick={() => navigate(`/services?category=${encodeURIComponent(cat.name)}`)}
                className="group cursor-pointer"
              >
                <div className={`aspect-square rounded-3xl ${cat.color} flex items-center justify-center text-4xl mb-4 transition-transform group-hover:rotate-6 shadow-sm`}>
                  {cat.icon}
                </div>
                <h3 className="text-center font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100">
              <ShieldCheck size={40} className="mb-6 text-indigo-200" />
              <h3 className="text-2xl font-bold mb-4">Verified Experts</h3>
              <p className="text-indigo-100 opacity-80 leading-relaxed">All our service providers go through a rigorous 5-step background check.</p>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <Clock size={40} className="mb-6 text-indigo-500" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Express Service</h3>
              <p className="text-slate-500 leading-relaxed">Book within minutes and get someone at your door in less than 60 minutes.</p>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <Star size={40} className="mb-6 text-amber-500" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Quality Guaranteed</h3>
              <p className="text-slate-500 leading-relaxed">Not satisfied with the job? We'll redo it for free or refund your money.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
