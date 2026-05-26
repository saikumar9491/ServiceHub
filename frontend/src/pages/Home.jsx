import React, { useState, useRef } from 'react';
import { Search, MapPin, Sparkles, ShieldCheck, Clock, Star, Home as HomeIcon, Wrench, Zap, Heart, BookOpen, Scale, Camera, Leaf } from 'lucide-react';
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
  const [locationInput, setLocationInput] = useState('');
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

    // 2. Premium 6-Card Spread & Collapse (from Master Prompt)
    const collapseWrappers = gsap.utils.toArray('.hero-card-collapse-wrapper');
    const cardWrappers = gsap.utils.toArray('.hero-card-wrapper');
    const inners = gsap.utils.toArray('.hero-card-inner');
    const originCard = document.querySelector('.origin-card');

    if (collapseWrappers.length && originCard) {
      const originRect = originCard.getBoundingClientRect();
      
      const cardData = collapseWrappers.map((collapseEl, i) => {
        const rect = collapseEl.getBoundingClientRect();
        return {
          collapseEl: collapseEl,
          entranceEl: cardWrappers[i],
          dx: originRect.left - rect.left,
          dy: originRect.top - rect.top,
        };
      });

      // 1. Instantly Set Origin State to prevent flash (on the ENTRANCE wrapper)
      cardData.forEach(({ entranceEl, dx, dy }) => {
        gsap.set(entranceEl, { x: dx, y: dy, scale: 0.9, opacity: 0 });
      });

      // 2. Animate Outward (Entrance Spread)
      const spreadTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.4 } });
      cardData.forEach(({ entranceEl }, i) => {
        spreadTl.to(entranceEl, { x: 0, y: 0, scale: 1, opacity: 1 }, 0.2 + (i * 0.05));
      });

      // 3. Idle Floating on the INNER elements (so it doesn't conflict with ScrollTrigger)
      inners.forEach((inner, i) => {
        gsap.to(inner, {
          yPercent: -4,
          duration: 2.5 + (i * 0.2), // Organic variance
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: spreadTl.duration() // Start floating after spread finishes
        });
      });

      // 4. Scroll-Linked Collapse (on the COLLAPSE wrapper)
      const collapseTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero-grid-section',
          start: 'top 30%', // Start collapsing as user scrolls past hero
          end: 'bottom top',
          scrub: 1.2, // Smoothed scrubbing
        }
      });
      
      cardData.forEach(({ collapseEl, dx, dy }) => {
        // Animate back to original stack coordinates using the outer wrapper
        collapseTl.to(collapseEl, { x: dx, y: dy, scale: 0.9, opacity: 0, ease: 'power2.inOut' }, 0);
      });
    }

    // (Idle animation replaced by the one inside the block above)

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
    // 5. Browse Categories Animation
    gsap.fromTo('.category-card',
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.browse-categories-section',
          start: 'top 75%', // trigger when section is 75% visible
        }
      }
    );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden flex items-center min-h-[90vh]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-indigo-100/60 to-transparent -z-10" />
        
        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: The Matter */}
          <div className="text-left">
            <div className="animate-hero-text inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white shadow-sm border border-indigo-50 text-indigo-600 text-sm font-semibold mb-8">
              <Sparkles size={16} />
              <span>Premium Services, Delivered</span>
            </div>
            
            <h1 className="animate-hero-text text-5xl lg:text-7xl font-extrabold text-slate-900 mb-8 leading-[1.1] tracking-tight">
              Book the best <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
                Local Experts
              </span> easily
            </h1>

            {/* Search Box */}
            <div className="animate-hero-text bg-white/80 backdrop-blur-xl p-3 rounded-3xl shadow-2xl shadow-indigo-200/50 flex flex-col xl:flex-row items-center gap-2 border border-white">
              <div className="flex-1 flex items-center gap-3 px-4 w-full">
                <MapPin className="text-indigo-500" size={22} />
                <input 
                  type="text" 
                  placeholder="Select your location..." 
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full py-4 bg-transparent border-none focus:ring-0 text-slate-800 text-lg placeholder:text-slate-400 outline-none"
                />
              </div>
              <div className="hidden xl:block w-px h-10 bg-slate-200" />
              <div className="flex-[1.5] flex items-center gap-3 px-4 w-full border-t border-slate-100 xl:border-none pt-2 xl:pt-0">
                <Search className="text-slate-400" size={22} />
                <input 
                  type="text" 
                  placeholder="What do you need?" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full py-4 bg-transparent border-none focus:ring-0 text-slate-800 text-lg placeholder:text-slate-400 outline-none"
                />
              </div>
              <Link 
                to={`/services?search=${encodeURIComponent(search)}&location=${encodeURIComponent(locationInput)}`}
                className="w-full xl:w-auto px-8 py-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-2xl transition-colors duration-300 shadow-xl flex items-center justify-center text-lg mt-2 xl:mt-0"
              >
                Explore
              </Link>
            </div>
          </div>

          {/* Right Column: The Animation */}
          <div className="hero-grid-section relative w-full h-[500px] md:h-[600px] mt-12 lg:mt-0">
            <div className="grid grid-cols-3 gap-4 md:gap-6 relative w-full h-full origin-point">
               {/* Column 1 (Pushed down) */}
               <div className="flex flex-col gap-4 md:gap-6 translate-y-8 md:translate-y-12">
                  <div className="hero-card-collapse-wrapper w-full origin-card">
                    <Link to="/services?category=Cleaning" className="hero-card-wrapper w-full block cursor-pointer group">
                      <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400" className="hero-card-inner rounded-[2rem] shadow-2xl object-cover w-full h-[150px] md:h-[200px] group-hover:shadow-indigo-500/30 transition-all duration-300" alt="Cleaning" />
                    </Link>
                  </div>
                  <div className="hero-card-collapse-wrapper w-full">
                    <Link to="/services?category=Plumbing" className="hero-card-wrapper w-full block cursor-pointer group">
                      <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=400" className="hero-card-inner rounded-[2rem] shadow-2xl object-cover w-full h-[180px] md:h-[240px] group-hover:shadow-indigo-500/30 transition-all duration-300" alt="Tools" />
                    </Link>
                  </div>
               </div>
               
               {/* Column 2 (Center, neutral) */}
               <div className="flex flex-col gap-4 md:gap-6 -translate-y-4 md:-translate-y-6">
                  <div className="hero-card-collapse-wrapper w-full">
                    <Link to="/services?category=Cleaning" className="hero-card-wrapper w-full block cursor-pointer group">
                      <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400" className="hero-card-inner rounded-[2rem] shadow-2xl object-cover w-full h-[200px] md:h-[260px] group-hover:shadow-indigo-500/30 transition-all duration-300" alt="Kitchen" />
                    </Link>
                  </div>
                  <div className="hero-card-collapse-wrapper w-full">
                    <Link to="/services?category=Plumbing" className="hero-card-wrapper w-full block cursor-pointer group">
                      <img src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=400" className="hero-card-inner rounded-[2rem] shadow-2xl object-cover w-full h-[140px] md:h-[180px] group-hover:shadow-indigo-500/30 transition-all duration-300" alt="Plumbing" />
                    </Link>
                  </div>
               </div>
               
               {/* Column 3 (Pushed up slightly) */}
               <div className="flex flex-col gap-4 md:gap-6 translate-y-4 md:translate-y-8">
                  <div className="hero-card-collapse-wrapper w-full">
                    <Link to="/services?category=Painting" className="hero-card-wrapper w-full block cursor-pointer group">
                      <img src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400" className="hero-card-inner rounded-[2rem] shadow-2xl object-cover w-full h-[160px] md:h-[220px] group-hover:shadow-indigo-500/30 transition-all duration-300" alt="Painting" />
                    </Link>
                  </div>
                  <div className="hero-card-collapse-wrapper w-full">
                    <Link to="/services?category=Electrician" className="hero-card-wrapper w-full block cursor-pointer group">
                      <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400" className="hero-card-inner rounded-[2rem] shadow-2xl object-cover w-full h-[180px] md:h-[240px] group-hover:shadow-indigo-500/30 transition-all duration-300" alt="Electrician" />
                    </Link>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* Browse Categories Section */}
      <section className="browse-categories-section bg-[#FAF8F5] py-24 border-t border-[#f0e9df]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="max-w-2xl">
              <span className="text-[#B28D5D] font-bold tracking-widest text-sm uppercase mb-4 block">
                Browse Categories
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight" style={{ fontFamily: '"DM Serif Display", serif' }}>
                Whatever You Need,<br/>We've Got You Covered
              </h2>
            </div>
            <Link to="/services" className="inline-flex items-center text-slate-900 font-semibold hover:text-[#B28D5D] transition-colors mt-8 md:mt-0 text-lg">
              View All <span className="ml-2">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category 1 */}
            <Link to="/services?category=Cleaning" className="category-card opacity-0 bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-cyan-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <HomeIcon className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Home Cleaning</h3>
              <p className="text-slate-500 font-medium">243 providers</p>
            </Link>

            {/* Category 2 */}
            <Link to="/services?category=Plumbing" className="category-card opacity-0 bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Wrench className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Plumbing &amp; Repairs</h3>
              <p className="text-slate-500 font-medium">189 providers</p>
            </Link>

            {/* Category 3 */}
            <Link to="/services?category=Electrical" className="category-card opacity-0 bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Electrical Work</h3>
              <p className="text-slate-500 font-medium">156 providers</p>
            </Link>

            {/* Category 4 */}
            <Link to="/services?category=Healthcare" className="category-card opacity-0 bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Healthcare &amp; Wellness</h3>
              <p className="text-slate-500 font-medium">312 providers</p>
            </Link>

            {/* Category 5 */}
            <Link to="/services?category=Tutoring" className="category-card opacity-0 bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-lime-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Tutoring &amp; Education</h3>
              <p className="text-slate-500 font-medium">408 providers</p>
            </Link>

            {/* Category 6 */}
            <Link to="/services?category=Legal" className="category-card opacity-0 bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Scale className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Legal Consultation</h3>
              <p className="text-slate-500 font-medium">94 providers</p>
            </Link>

            {/* Category 7 */}
            <Link to="/services?category=Photography" className="category-card opacity-0 bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Camera className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Photography</h3>
              <p className="text-slate-500 font-medium">217 providers</p>
            </Link>

            {/* Category 8 */}
            <Link to="/services?category=Landscaping" className="category-card opacity-0 bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Leaf className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Landscaping</h3>
              <p className="text-slate-500 font-medium">133 providers</p>
            </Link>
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
