import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Users,
  Target,
  Shield,
  ArrowRight,
  Globe,
  Zap,
  CheckCircle,
  Clock,
  Building2,
  ChevronLeft,
  User
} from 'lucide-react';
import logo from '../assets/logooo.png';
import NotificationDropdown from './NotificationDropdown';

// Team Assets
import jithu from '../assets/jithu.jpg';
import sasi from '../assets/sasi.jpg';
import hari from '../assets/hari.jpg';
import shock from '../assets/shock.jpg';

const About = () => {
  const { user: currentUser } = useAuth();

  const team = [
    {
      name: "Viswajith E",
      role: "CEO & Founder",
      bio: "Visionary leader focused on modern staffing solutions and marketplace growth.",
      img: jithu
    },
    {
      name: "Adharsh A.S",
      role: "Business Manager",
      bio: "Strategic manager driving business growth and platform expansion.",
      img: sasi
    },
    {
      name: "Hari Prasad E",
      role: "Head of Operations",
      bio: "Operations expert optimizing delivery workflows and network logistics.",
      img: hari
    },
    {
      name: "Ananthu K",
      role: "Customer Success",
      bio: "Support leader ensuring exceptional experiences for every user and employer.",
      img: shock
    }
  ];

  const milestones = [
    { year: "2022", title: "Foundation", description: "Flexora platform launched to revolutionize on-demand staffing." },
    { year: "2023", title: "10K Milestone", description: "Reached a major milestone of 10,000 successful job matches." },
    { year: "2024", title: "Expansion", description: "Secured funding to expand our reach across Kerala." },
    { year: "2025", title: "Regional Lead", description: "Providing modern staffing solutions across major cities." }
  ];

  const values = [
    { icon: <Zap size={24} />, title: "Velocity", description: "Fill positions in hours, not days. We prioritize efficient matching." },
    { icon: <Shield size={24} />, title: "Integrity", description: "Verified professionals and secure payments. Trust is our core foundation." },
    { icon: <Globe size={24} />, title: "Scalability", description: "Seamlessly scale your workforce up or down based on real-time demand." }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30 font-sans">

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] px-6 h-20 flex justify-between items-center bg-slate-950/80 border-b border-slate-900 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Flexora" className="h-18 w-auto" />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">home</Link>
          <Link to="/about" className="text-sm font-bold uppercase tracking-widest text-white transition-colors underline underline-offset-8 decoration-blue-500 decoration-2">about</Link>
          {(!currentUser || currentUser.role === 'job_seeker') && (
            <Link to="/jobs" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">jobs</Link>
          )}
          {currentUser?.role === 'job_provider' && (
            <Link to="/post-job" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Post Job</Link>
          )}
          {currentUser?.role === 'admin' && (
            <Link to="/flexora-admin" className="text-blue-500 font-bold text-sm uppercase tracking-widest hover:text-blue-400 transition-colors">Admin Hub</Link>
          )}
          
          {currentUser ? (
            <div className="flex items-center gap-6 pl-4 border-l border-slate-900">
               <NotificationDropdown />
               <Link to="/userprofile" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <User size={14} />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{currentUser.name?.split(' ')[0]}</span>
               </Link>
            </div>
          ) : (
            <>
              <Link to="/flexoraauth" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">log in</Link>
              <Link to="/flexoraauth" className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">signup</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-44 pb-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full mb-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Corporate Mission</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-10 text-white uppercase leading-[0.9]">
            Modern <span className="text-slate-500 italic font-medium">Staffing</span><br />
            for the Gig <span className="text-blue-600 italic">Economy</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Building the infrastructure for on-demand labor since 2022. We bridge the gap between urgent business needs and skilled local talent.
          </p>
        </motion.div>
      </section>

      {/* STORY SECTION */}
      <section className="py-32 px-6 lg:px-8 border-y border-slate-900 bg-slate-900/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-blue-500 font-bold text-[10px] uppercase tracking-widest mb-6 flex items-center gap-4">
              <div className="w-12 h-px bg-blue-600" /> Executive Summary
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-8 uppercase">Our Story</h2>
            <div className="space-y-6 text-slate-400 text-base md:text-lg leading-relaxed font-medium">
              <p>
                Flexora was founded to address the growing friction in local staffing. Traditional recruitment methods failed to keep up with the speed of modern business.
              </p>
              <p>
                We engineered a high-performance network that allows companies to scale instantly while offering professionals complete flexibility over their schedule.
              </p>
              <div className="pt-8 grid grid-cols-2 gap-12">
                <div>
                  <div className="text-4xl font-bold text-white tracking-tight">50,000+</div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-600 mt-2">Registered Users</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white tracking-tight">8,500+</div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-600 mt-2">Business Partners</div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[400px] md:h-[600px] rounded-[48px] overflow-hidden border border-slate-800 shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              alt="Platform in Action"
              className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-12 left-12">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-600/20 border border-blue-600/30 rounded-xl">
                <Shield className="text-blue-500 w-5 h-5" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">Enterprise Secure</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-32 px-6 lg:px-8 border-b border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-4">Foundation</h2>
            <p className="text-3xl md:text-6xl font-bold text-white tracking-tight uppercase">Core Principles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-[40px] p-12 hover:border-slate-700 transition-all group"
              >
                <div className="w-16 h-16 bg-blue-600/10 border border-blue-600/20 rounded-2xl flex items-center justify-center mb-10 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {val.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight uppercase">{val.title}</h3>
                <p className="text-slate-500 text-base leading-relaxed font-medium">
                  {val.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-32 px-6 lg:px-8 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div>
              <h2 className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-4">Leadership</h2>
              <p className="text-4xl md:text-7xl font-bold text-white tracking-tight uppercase leading-[0.9]">Meet the <br /><span className="text-slate-500 italic font-medium">Architects.</span></p>
            </div>
            <p className="text-slate-500 text-sm md:text-base max-w-sm font-medium leading-relaxed italic">
              "Building the future of labor through engineering and community-first scaling."
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden group hover:border-slate-700 transition-all"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale brightness-75 transition-all duration-500 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <div className="text-[10px] font-bold tracking-widest text-blue-500 uppercase mb-1">{member.role}</div>
                  <div className="text-xl font-bold text-white tracking-tight uppercase mb-4">{member.name}</div>
                  <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-32 px-6 lg:px-8 border-t border-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-4">Milestones</h2>
            <p className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase">Corporate History</p>
          </div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row gap-8 items-start md:items-center p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-slate-700 transition-all"
              >
                <div className="text-3xl font-bold text-blue-600 tracking-tighter w-24 shrink-0">
                  {milestone.year}
                </div>
                <div className="h-px bg-slate-800 flex-1 hidden md:block" />
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-2">{milestone.title}</h3>
                  <p className="text-slate-500 text-sm font-medium">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-blue-600 rounded-[64px] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-600/20">
          <div className="absolute top-0 right-0 w-full h-full bg-slate-950/20 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-none uppercase">
              Join the <br /><span className="italic font-medium text-slate-100/50">Next Generation.</span>
            </h2>
            <p className="text-blue-100 text-lg mb-12 max-w-xl mx-auto font-medium">
              Start hiring or find your next professional engagement today on our high-performance network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/flexoraauth" className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl">
                Get Started
              </Link>
              <Link to="/jobs" className="bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-blue-800 transition-all">
                Browse Network
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-900 text-center">
        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Flexora Corporation. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default About;