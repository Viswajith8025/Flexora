import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  DollarSign,
  Shield,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Briefcase,
  TrendingUp,
  Building2,
  Users,
  Zap
} from 'lucide-react';
import logo from '../assets/logooo.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SlideButton from './SlideButton';
import NotificationDropdown from './NotificationDropdown';
import { User } from 'lucide-react';
import api from '../services/api';

const Flexora = () => {
  const { user: currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [stats, setStats] = useState({
    totalJobs: 0,
    totalUsers: 0,
    partnerCompanies: 0,
    satisfactionRate: "98.2%"
  });

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const { data } = await api.getPublicStats();
        setStats(prev => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Stats Fetch Error:", err);
      }
    };
    fetchPublicStats();
  }, []);

  const features = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Same-Day Hiring",
      description: "Post a job in 2 minutes. Get applicants the same day."
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Nearby Work",
      description: "Jobs matched to your location. Less commute, more income."
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      title: "Transparent Pay",
      description: "Every listing shows pay upfront. No surprises after the work is done."
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Verified Listings",
      description: "All job providers are registered. Seekers are profile-verified."
    }
  ];

  const jobTypes = [
    { name: "Event Crew", icon: <Users size={24} className="text-blue-500" /> },
    { name: "Delivery Partner", icon: <Zap size={24} className="text-amber-500" /> },
    { name: "Hospitality", icon: <Shield size={24} className="text-emerald-500" /> },
    { name: "Technical Support", icon: <TrendingUp size={24} className="text-purple-500" /> },
    { name: "Marketing", icon: <Briefcase size={24} className="text-rose-500" /> },
    { name: "Logistics", icon: <Building2 size={24} className="text-sky-500" /> },
    { name: "Photography", icon: <Zap size={24} className="text-yellow-500" /> },
    { name: "Consulting", icon: <Building2 size={24} className="text-indigo-500" /> }
  ];

  const howItWorks = {
    seekers: [
      { step: "01", title: "Create a profile", desc: "Set up your skills and availability in under 3 minutes." },
      { step: "02", title: "Browse nearby jobs", desc: "Filter by category, location, and pay rate." },
      { step: "03", title: "Apply and track", desc: "One-click apply. Get status updates in real time." },
    ],
    providers: [
      { step: "01", title: "Post your opening", desc: "Describe the role, location, and what you'll pay." },
      { step: "02", title: "Review applicants", desc: "See profiles, ratings, and work history." },
      { step: "03", title: "Hire and manage", desc: "Confirm your hire directly through the platform." },
    ]
  };

  const [activeRole, setActiveRole] = useState('seekers');

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 border-b border-slate-900 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Flexora" className="h-16 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
              home
            </Link>
            <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
              how it works
            </button>
            <Link to="/about" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
              about
            </Link>
            {(!currentUser || currentUser.role === 'job_seeker') && (
              <Link to="/jobs" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                jobs
              </Link>
            )}
            {currentUser?.role === 'job_provider' && (
              <Link to="/my-jobs" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                dashboard
              </Link>
            )}
            {currentUser?.role === 'admin' && (
              <Link to="/flexora-admin" className="text-sm font-bold uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors">
                admin hub
              </Link>
            )}

            {currentUser ? (
              <div className="flex items-center gap-6 pl-4 border-l border-slate-900">
                <NotificationDropdown />
                <Link to="/userprofile" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <User size={14} />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{currentUser.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="text-sm font-bold uppercase tracking-widest text-slate-700 hover:text-red-500 transition-colors">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/flexoraauth" state={{ mode: 'login' }} className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                  log in
                </Link>
                <SlideButton to="/flexoraauth" state={{ mode: 'signup' }} className="px-6 py-2 !text-[10px] uppercase">
                  signup
                </SlideButton>
              </>
            )}
          </nav>

          <button className="md:hidden p-2 text-slate-400 hover:text-white touch-target" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="md:hidden absolute top-20 left-0 w-full bg-slate-900 border-b border-slate-800 px-6 py-8 space-y-6 shadow-2xl"
            >
              <Link to="/" className="block text-xs font-bold uppercase tracking-widest text-white" onClick={() => setIsMenuOpen(false)}>home</Link>
              <button onClick={() => scrollToSection('how-it-works')} className="block text-xs font-bold uppercase tracking-widest text-white w-full text-left">how it works</button>
              <Link to="/about" className="block text-xs font-bold uppercase tracking-widest text-white" onClick={() => setIsMenuOpen(false)}>about</Link>
              {(!currentUser || currentUser.role === 'job_seeker') && (
                <Link to="/jobs" className="block text-xs font-bold uppercase tracking-widest text-white" onClick={() => setIsMenuOpen(false)}>jobs</Link>
              )}
              {currentUser?.role === 'job_provider' && (
                <Link to="/my-jobs" className="block text-xs font-bold uppercase tracking-widest text-white" onClick={() => setIsMenuOpen(false)}>dashboard</Link>
              )}
              {currentUser?.role === 'admin' && (
                <Link to="/flexora-admin" className="block text-xs font-bold uppercase tracking-widest text-blue-400" onClick={() => setIsMenuOpen(false)}>admin hub</Link>
              )}
              <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
                <Link to="/flexoraauth" state={{ mode: 'login' }} onClick={() => setIsMenuOpen(false)} className="text-center py-3 text-xs font-bold uppercase tracking-widest text-slate-400">log in</Link>
                <Link to="/flexoraauth" state={{ mode: 'signup' }} onClick={() => setIsMenuOpen(false)} className="bg-blue-600 text-white py-4 rounded-xl text-center text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-600/20">signup</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="relative pt-40 sm:pt-52 pb-28 sm:pb-36 border-b border-slate-900 overflow-hidden">
          {/* Realism: Cinematic Hero Asset */}
          <div className="absolute inset-0 z-0 opacity-20">
            <img
              src="/c:/Users/Hp/OneDrive/Desktop/PROJECTS/Vibe%20coding/Flexora/Client/src/assets/hero_bg.png"
              className="w-full h-full object-cover grayscale"
              alt="Background"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/80 to-slate-950" />
          </div>

          <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em]">Kerala's flexible work platform</span>
              </div>

              <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-white mb-8 tracking-tight leading-[1.05]">
                Work today.{' '}
                <span className="text-slate-500 italic font-medium">GetPaid tomorrow.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 mb-12 max-w-xl mx-auto leading-relaxed">
                Flexora connects job seekers with short-term work across Kerala.
                Apply in minutes. Providers hire the same day.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <SlideButton
                  to={currentUser ? "/post-job" : "/flexoraauth"}
                  state={!currentUser ? { mode: 'signup' } : undefined}
                  className="w-full sm:w-auto !py-4 !px-10 !text-base shadow-xl shadow-blue-600/25"
                >
                  Post a Job
                </SlideButton>
                <SlideButton to="/jobs" variant="secondary" className="w-full sm:w-auto !py-4 !px-10 !text-base">
                  Browse Jobs
                </SlideButton>
              </div>
            </motion.div>
          </div>

          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/4 rounded-full blur-[140px] pointer-events-none" />
        </section>

        {/* ── Trust Bar ─────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 border-b border-slate-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
              {[
                { number: stats.totalJobs.toLocaleString(), label: "Active Opportunites" },
                { number: stats.totalUsers.toLocaleString(), label: "Verified Specialists" },
                { number: stats.partnerCompanies.toLocaleString(), label: "Partner Companies" },
                { number: stats.satisfactionRate, label: "Satisfaction Rate" }
              ].map((stat) => (
                <div key={stat.label} className="text-center group cursor-default">
                  <div className="text-3xl sm:text-4xl font-black text-white mb-1 tracking-tight group-hover:text-blue-500 transition-colors">{stat.number}</div>
                  <div className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.25em]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Job Categories ────────────────────────────────────────────── */}
        <section className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
              <div>
                <p className="text-blue-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-3">Categories</p>
                <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
                  What kind of <span className="text-slate-500 italic font-medium">work?</span>
                </h2>
              </div>
              <Link to="/jobs" className="text-blue-500 text-sm font-bold flex items-center gap-1.5 hover:text-blue-400 transition-colors shrink-0 group">
                See all jobs <ArrowRight size={15} className="icon-nudge" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {jobTypes.map((job) => (
                <Link
                  key={job.name}
                  to="/jobs"
                  className="flex-card p-6 sm:p-8 bg-slate-900/40 border-slate-800/50 backdrop-blur-sm hover:bg-slate-900/60 transition-all micro-lift group relative overflow-hidden"
                >
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-600/5 rounded-full blur-2xl group-hover:bg-blue-600/10 transition-colors" />
                  <div className="mb-6 opacity-60 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-500">
                    {job.icon}
                  </div>
                  <div className="flex-label text-white uppercase mb-1">{job.name}</div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-blue-400 transition-colors italic">
                    Marketplace Sector
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-24 sm:py-32 border-y border-slate-900 bg-slate-900/20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-blue-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-3">How it works</p>
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
                Simple for <span className="text-slate-500 italic font-medium">everyone</span>
              </h2>
            </div>

            {/* Role Switcher */}
            <div className="flex justify-center mb-12">
              <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1.5">
                {['seekers', 'providers'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setActiveRole(role)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeRole === role
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-500 hover:text-white'
                      }`}
                  >
                    {role === 'seekers' ? 'Job Seekers' : 'Employers'}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeRole}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-6"
              >
                {howItWorks[activeRole].map((item, i) => (
                  <div key={i} className="flex-card p-8 hover:bg-slate-900/40 transition-all border-dashed">
                    <div className="text-blue-600/20 font-black text-5xl mb-8 leading-none">{item.step}</div>
                    <h3 className="flex-label text-white uppercase text-lg mb-4">{item.title}</h3>
                    <p className="flex-meta lowercase italic leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ── Why Flexora ─────────────────────────────────────────────── */}
        <section className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <p className="text-blue-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Why Flexora</p>
                <h2 className="text-3xl sm:text-5xl font-bold text-white mb-10 tracking-tight leading-tight">
                  Built for the way<br />
                  <span className="text-slate-500 italic font-medium">short-term work actually works.</span>
                </h2>
                <div className="space-y-5">
                  {[
                    "Same-day placements — post and hire within hours",
                    "Pay shown upfront on every listing — no negotiation needed",
                    "Applicants with verified profiles and work history",
                    "Direct messaging between seekers and employers"
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-4 group">
                      <div className="w-5 h-5 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500 shrink-0 mt-0.5">
                        <CheckCircle size={12} />
                      </div>
                      <span className="text-slate-400 text-sm leading-relaxed font-medium group-hover:text-white transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform snapshot card */}
              <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 sm:p-12">
                <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.3em] mb-8">Platform at a glance</p>
                <div className="space-y-6">
                  {[
                    { label: "Average time to first applicant", value: "< 2 hours" },
                    { label: "Avg. employer rating", value: "4.8 / 5" },
                    { label: "Most common job duration", value: "4–8 hrs" },
                    { label: "Platform response time", value: "Same day" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-4 border-b border-slate-800/60 last:border-0">
                      <span className="text-slate-500 text-xs font-medium">{row.label}</span>
                      <span className="text-white font-bold text-sm">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-10">
                  <SlideButton
                    to="/flexoraauth"
                    className="w-full !py-4 shadow-lg shadow-blue-600/20"
                  >
                    Start Hiring Today
                  </SlideButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="py-24 sm:py-32 border-t border-slate-900">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
              Find work or hire talent.<br />
              <span className="text-slate-500 italic font-medium">Start in minutes.</span>
            </h2>
            <p className="text-slate-500 text-base mb-10 leading-relaxed">
              No hidden fees. No long onboarding. Just useful tools to connect the right people.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SlideButton
                to="/flexoraauth"
                state={!currentUser ? { mode: 'signup' } : undefined}
                className="w-full sm:w-auto !py-4 !px-10 shadow-xl shadow-blue-600/20"
              >
                Create Account
              </SlideButton>
              <SlideButton to="/jobs" variant="secondary" className="w-full sm:w-auto !py-4 !px-10">
                Browse Jobs
              </SlideButton>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-14 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between gap-10">
            <div className="max-w-xs">
              <img src={logo} alt="Flexora" className="h-9 mb-4" />
              <p className="text-slate-600 text-sm leading-relaxed">
                Short-term work, done right. For job seekers and employers across Kerala.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-12 text-sm">
              <div>
                <h4 className="text-white font-bold mb-5 uppercase tracking-widest text-[10px]">Platform</h4>
                <ul className="space-y-3 text-slate-500">
                  <li><Link to="/jobs" className="hover:text-white transition-colors">Find Jobs</Link></li>
                  <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">How it Works</button></li>
                  <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-5 uppercase tracking-widest text-[10px]">Legal</h4>
                <ul className="space-y-3 text-slate-500">
                  <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                  <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-700 text-[10px] font-bold uppercase tracking-widest">© 2025 Flexora. All rights reserved.</p>
            <div className="flex gap-6 text-slate-700 text-[10px] font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-slate-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-slate-400 transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Flexora;