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

    // 2. Premium 6-Card Spread & Collapse (from Master Prompt)
    const cardWrappers = gsap.utils.toArray('.hero-card-wrapper');
    const inners = gsap.utils.toArray('.hero-card-inner');
    const originCard = document.querySelector('.origin-card');

    if (cardWrappers.length && originCard) {
      // Small timeout to ensure layout is calculated before reading BoundingClientRect
      setTimeout(() => {
        const originRect = originCard.getBoundingClientRect();
        
        const cardData = cardWrappers.map(card => {
          const rect = card.getBoundingClientRect();
          return {
            el: card,
            dx: originRect.left - rect.left,
            dy: originRect.top - rect.top,
          };
        });

        // 1. Instantly Set Origin State to prevent flash
        cardData.forEach(({ el, dx, dy }) => {
          gsap.set(el, { x: dx, y: dy, scale: 0.9, opacity: 0 });
        });

        // 2. Animate Outward (Entrance Spread)
        const spreadTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.4 } });
        cardData.forEach(({ el }, i) => {
          spreadTl.to(el, { x: 0, y: 0, scale: 1, opacity: 1 }, 0.2 + (i * 0.05));
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

        // 4. Scroll-Linked Collapse
        const collapseTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.hero-grid-section',
            start: 'top 30%', // Start collapsing as user scrolls past hero
            end: 'bottom top',
            scrub: 1.2, // Smoothed scrubbing
          }
        });
        
        cardData.forEach(({ el, dx, dy }) => {
          // Animate back to original stack coordinates
          collapseTl.to(el, { x: dx, y: dy, scale: 0.9, opacity: 0, ease: 'power2.inOut' }, 0);
        });
      }, 100);
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

    // 5. Multi-Step Scroll Swap
    const swapTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.features-swap-section',
        start: 'top top',
        end: '+=100%',
        scrub: true,
        pin: true,
      }
    });

    swapTimeline.to('.features-row-1', {
        opacity: 0, y: -50, duration: 0.4
    }).fromTo('.features-row-2',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.4 },
        '-=0.2'
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
                to={search ? `/services?search=${search}` : `/services`}
                className="w-full xl:w-auto px-8 py-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-2xl transition-colors duration-300 shadow-xl flex items-center justify-center text-lg mt-2 xl:mt-0"
              >
                Explore
              </Link>
            </div>
          </div>

          {/* Right Column: The Animation */}
          <div className="hero-grid-section relative w-full h-[500px] md:h-[600px] pointer-events-none mt-12 lg:mt-0">
            <div className="grid grid-cols-3 gap-4 md:gap-6 relative w-full h-full origin-point">
               {/* Column 1 (Pushed down) */}
               <div className="flex flex-col gap-4 md:gap-6 translate-y-8 md:translate-y-12">
                  <div className="hero-card-wrapper w-full origin-card">
                    <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400" className="hero-card-inner rounded-[2rem] shadow-2xl object-cover w-full h-[150px] md:h-[200px]" alt="Cleaning" />
                  </div>
                  <div className="hero-card-wrapper w-full">
                    <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=400" className="hero-card-inner rounded-[2rem] shadow-2xl object-cover w-full h-[180px] md:h-[240px]" alt="Tools" />
                  </div>
               </div>
               
               {/* Column 2 (Center, neutral) */}
               <div className="flex flex-col gap-4 md:gap-6 -translate-y-4 md:-translate-y-6">
                  <div className="hero-card-wrapper w-full">
                    <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400" className="hero-card-inner rounded-[2rem] shadow-2xl object-cover w-full h-[200px] md:h-[260px]" alt="Kitchen" />
                  </div>
                  <div className="hero-card-wrapper w-full">
                    <img src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=400" className="hero-card-inner rounded-[2rem] shadow-2xl object-cover w-full h-[140px] md:h-[180px]" alt="Plumbing" />
                  </div>
               </div>
               
               {/* Column 3 (Pushed up slightly) */}
               <div className="flex flex-col gap-4 md:gap-6 translate-y-4 md:translate-y-8">
                  <div className="hero-card-wrapper w-full">
                    <img src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400" className="hero-card-inner rounded-[2rem] shadow-2xl object-cover w-full h-[160px] md:h-[220px]" alt="Painting" />
                  </div>
                  <div className="hero-card-wrapper w-full">
                    <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400" className="hero-card-inner rounded-[2rem] shadow-2xl object-cover w-full h-[180px] md:h-[240px]" alt="Electrician" />
                  </div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* Morphing Features Swap Section */}
      <section className="features-swap-section h-screen bg-white relative flex flex-col items-center justify-center overflow-hidden border-t border-slate-100">
        <div className="text-center mb-16 relative z-10 w-full px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Everything You Need</h2>
          <p className="text-slate-500 text-xl">Seamlessly manage your home with one tap.</p>
        </div>
        
        <div className="relative w-full max-w-5xl mx-auto h-[300px]">
          {/* Row 1 */}
          <div className="features-row-1 absolute inset-0 flex flex-col md:flex-row justify-center gap-8 px-6 w-full">
             <div className="bg-indigo-50 rounded-[2rem] p-10 flex-1 border border-indigo-100 shadow-lg shadow-indigo-100/50">
               <h3 className="text-3xl font-extrabold text-indigo-900 mb-4">Instant Quotes</h3>
               <p className="text-indigo-700/80 text-lg leading-relaxed">Get upfront pricing instantly before you book. No hidden fees or surprises.</p>
             </div>
             <div className="bg-indigo-50 rounded-[2rem] p-10 flex-1 border border-indigo-100 shadow-lg shadow-indigo-100/50">
               <h3 className="text-3xl font-extrabold text-indigo-900 mb-4">Live Tracking</h3>
               <p className="text-indigo-700/80 text-lg leading-relaxed">Track your professional's arrival in real-time on the map.</p>
             </div>
          </div>
          
          {/* Row 2 */}
          <div className="features-row-2 absolute inset-0 flex flex-col md:flex-row justify-center gap-8 px-6 w-full opacity-0 translate-y-[50px]">
             <div className="bg-purple-50 rounded-[2rem] p-10 flex-1 border border-purple-100 shadow-lg shadow-purple-100/50">
               <h3 className="text-3xl font-extrabold text-purple-900 mb-4">Cashless Payments</h3>
               <p className="text-purple-700/80 text-lg leading-relaxed">Pay securely through the app only after the job is completed perfectly.</p>
             </div>
             <div className="bg-purple-50 rounded-[2rem] p-10 flex-1 border border-purple-100 shadow-lg shadow-purple-100/50">
               <h3 className="text-3xl font-extrabold text-purple-900 mb-4">Digital Invoices</h3>
               <p className="text-purple-700/80 text-lg leading-relaxed">Keep all your home maintenance records neatly organized in one place.</p>
             </div>
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
