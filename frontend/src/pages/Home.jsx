import React, { useState, useRef } from 'react';
import { Search, MapPin, Sparkles, ShieldCheck, Clock, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
  const containerRef = useRef(null);

  useGSAP(() => {
    // 1. Entrance Animations (Hero Stagger)
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });
    tl.fromTo('.animate-hero-text', 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15 }
    );

    // 2. Premium Spread for Category Cards
    const cards = gsap.utils.toArray('.category-card');
    gsap.fromTo(cards, 
      {
        x: () => (Math.random() - 0.5) * window.innerWidth,
        y: () => (Math.random() - 0.5) * 500,
        scale: 0.2,
        opacity: 0,
      },
      {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.8,
        ease: 'power4.out',
        stagger: 0.05,
        delay: 0.2,
      }
    );

    // 3. Idle Floating Animation for icons
    gsap.to('.float-icon', {
      yPercent: -10,
      duration: 2.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: {
        each: 0.2,
        from: 'random',
      },
    });

    // 4. Sticky Stacking & Depth Recession Transitions
    const badges = gsap.utils.toArray('.trust-badge');
    badges.forEach((badge, i) => {
      if (i !== badges.length - 1) {
        gsap.to(badge, {
          yPercent: -15,
          scale: 0.9,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: badge,
            start: 'top 120px', 
            endTrigger: badges[i + 1],
            end: 'top 120px',
            scrub: true,
          },
        });
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden flex flex-col items-center justify-start min-h-[90vh]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-indigo-100/60 to-transparent -z-10" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-hero-text inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white shadow-sm border border-indigo-50 text-indigo-600 text-sm font-semibold mb-8">
              <Sparkles size={16} />
              <span>Premium Services, Delivered</span>
            </div>
            
            <h1 className="animate-hero-text text-6xl md:text-7xl font-extrabold text-slate-900 mb-8 leading-[1.1] tracking-tight">
              Book the best <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
                Local Experts
              </span> easily
            </h1>

            {/* Search Box */}
            <div className="animate-hero-text bg-white/80 backdrop-blur-xl p-3 rounded-3xl shadow-2xl shadow-indigo-200/50 flex flex-col md:flex-row items-center gap-2 border border-white">
              <div className="flex-1 flex items-center gap-3 px-4 w-full">
                <MapPin className="text-indigo-500" size={22} />
                <input 
                  type="text" 
                  placeholder="Select your location..." 
                  className="w-full py-4 bg-transparent border-none focus:ring-0 text-slate-800 text-lg placeholder:text-slate-400 outline-none"
                />
              </div>
              <div className="hidden md:block w-px h-10 bg-slate-200" />
              <div className="flex-[1.5] flex items-center gap-3 px-4 w-full">
                <Search className="text-slate-400" size={22} />
                <input 
                  type="text" 
                  placeholder="What do you need help with?" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full py-4 bg-transparent border-none focus:ring-0 text-slate-800 text-lg placeholder:text-slate-400 outline-none"
                />
              </div>
              <Link 
                to={search ? `/services?search=${search}` : `/services`}
                className="w-full md:w-auto px-10 py-5 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-2xl transition-colors duration-300 shadow-xl flex items-center justify-center text-lg"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>

        {/* Dynamic Spread Categories */}
        <div className="categories-section container mx-auto px-6 mt-24">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/services?category=${encodeURIComponent(cat.name)}`)}
                className="category-card group cursor-pointer bg-white/60 backdrop-blur-md border border-white rounded-3xl p-6 flex flex-col items-center justify-center hover:shadow-xl hover:bg-white transition-all duration-300"
              >
                <div className={`float-icon w-20 h-20 rounded-2xl ${cat.color} flex items-center justify-center text-4xl mb-6 shadow-inner`}>
                  {cat.icon}
                </div>
                <h3 className="text-center font-bold text-slate-800 text-lg">
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Stacking Trust Badges */}
      <section className="py-32 bg-slate-950 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Why Choose Us?</h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">Experience the most luxurious, reliable, and premium service booking platform on the market.</p>
          </div>
          
          <div className="relative" style={{ height: '250vh' }}>
            <div className="sticky top-[120px] trust-badge bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[3rem] p-16 text-white shadow-2xl origin-top mb-[50vh] border border-indigo-400/20">
              <ShieldCheck size={56} className="mb-8 text-indigo-200" />
              <h3 className="text-4xl font-extrabold mb-6 tracking-tight">Verified Elite Experts</h3>
              <p className="text-indigo-100/80 text-xl leading-relaxed max-w-2xl">Every single professional on our platform undergoes a rigorous, world-class 5-step vetting process to ensure your absolute safety and satisfaction.</p>
            </div>
            
            <div className="sticky top-[120px] trust-badge bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] p-16 text-white shadow-2xl origin-top mb-[50vh] border border-slate-700">
              <Clock size={56} className="mb-8 text-indigo-400" />
              <h3 className="text-4xl font-extrabold mb-6 tracking-tight">Lightning Fast Service</h3>
              <p className="text-slate-300 text-xl leading-relaxed max-w-2xl">Time is a luxury. Book within minutes and have a top-tier expert at your doorstep in under 60 minutes. No waiting, no hassle.</p>
            </div>
            
            <div className="sticky top-[120px] trust-badge bg-white rounded-[3rem] p-16 text-slate-900 shadow-2xl origin-top border border-slate-100">
              <Star size={56} className="mb-8 text-amber-500" />
              <h3 className="text-4xl font-extrabold mb-6 tracking-tight">Perfection Guaranteed</h3>
              <p className="text-slate-600 text-xl leading-relaxed max-w-2xl">We hold ourselves to the highest standards. If you are not absolutely thrilled with the job, we will redo it perfectly or refund you instantly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
