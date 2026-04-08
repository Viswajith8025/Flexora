import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { 
  User,
  Settings,
  Briefcase,
  Star,
  CheckCircle,
  DollarSign,
  MapPin,
  Calendar,
  Award,
  Users as UsersIcon,
  BarChart2,
  Edit2,
  Bookmark,
  Clock,
  Zap,
  Shield,
  Mail,
  Phone,
  Globe,
  ChevronLeft,
  Camera,
  Share2,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logooo.png';

const UserProfilePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
          setCurrentUser(userData);
        } else {
          const { data } = await api.getCurrentUser();
          setCurrentUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditToggle = () => setIsEditing(!isEditing);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) return null;

  const role = currentUser.role || 'job_seeker';
  const isProvider = role === 'job_provider' || role === 'provider';

  // Fallback defaults for visual polish
  const profileData = {
    name: currentUser.name || "Member",
    email: currentUser.email || "user@flexora.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
    location: isProvider ? "Kochi, Kerala" : "Calicut, Kerala",
    bio: isProvider 
      ? "Leading the way in local event management and temporary staffing solutions." 
      : "Dedicated professional looking for short-term opportunities in event management and delivery.",
    rating: 4.9,
    since: "March 2024",
    stats: isProvider ? [
      { label: "Jobs Posted", value: "12", icon: <Briefcase /> },
      { label: "Total Hires", value: "48", icon: <UsersIcon /> },
      { label: "Avg Rating", value: "4.8", icon: <Star /> }
    ] : [
      { label: "Jobs Done", value: "15", icon: <CheckCircle /> },
      { label: "Earnings", value: "₹18.5k", icon: <DollarSign /> },
      { label: "Avg Rating", value: "4.9", icon: <Star /> }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      
      {/* Premium Header */}
      <nav className="fixed top-0 w-full z-[100] px-6 h-20 flex justify-between items-center bg-slate-950/80 border-b border-slate-900 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Flexora" className="h-11 w-auto" />
        </Link>
        <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors flex items-center gap-2">
           <ChevronLeft size={14} /> Back Home
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-24">
        
        {/* Profile Identity Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-12"
        >
          {/* Cover Area */}
          <div className="h-48 sm:h-64 rounded-[40px] bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-900 overflow-hidden relative shadow-2xl">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
             <div className="absolute top-0 right-0 w-full h-full bg-blue-600/5 blur-[120px] pointer-events-none" />
          </div>

          {/* Identity Bar */}
          <div className="px-8 sm:px-14 flex flex-col md:flex-row md:items-end justify-between -mt-16 sm:-mt-24 pb-8 sm:pb-12 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
              <div className="relative group">
                <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-[32px] bg-slate-900 border-4 sm:border-8 border-slate-950 shadow-2xl overflow-hidden">
                  <img 
                    src={profileData.avatar} 
                    alt={profileData.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                </div>
                <button className="absolute bottom-2 right-2 p-2.5 bg-blue-600 text-white rounded-xl shadow-xl hover:bg-blue-500 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                  <Camera size={16} />
                </button>
              </div>

              <div className="text-center md:text-left pt-6 pb-2">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                   <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase leading-none">{profileData.name}</h1>
                   <div className="px-2 py-0.5 bg-blue-600/10 border border-blue-600/20 text-blue-500 text-[8px] font-black uppercase tracking-widest rounded-md">
                      Verified
                   </div>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-slate-500 text-[10px] font-bold uppercase tracking-widest font-mono">
                   <div className="flex items-center gap-2"><MapPin size={12} className="text-blue-500" /> {profileData.location}</div>
                   <div className="flex items-center gap-2"><Star size={12} className="text-amber-500 fill-amber-500/20" /> {profileData.rating} Rating</div>
                   <div className="flex items-center gap-2"><Calendar size={12} className="text-slate-700" /> Member since {profileData.since}</div>
                </div>
              </div>
            </div>

            <div className="mt-8 md:mt-24 flex gap-3">
               <button 
                 onClick={handleEditToggle}
                 className="flex-1 md:flex-none px-6 py-3 bg-slate-900 border border-slate-800 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:border-slate-700 transition-all flex items-center justify-center gap-2"
               >
                 {isEditing ? <CheckCircle size={14} /> : <Edit2 size={14} />} 
                 {isEditing ? "Save Profile" : "Edit Profile"}
               </button>
               <button className="p-3 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl hover:text-white transition-all">
                  <Share2 size={16} />
               </button>
            </div>
          </div>
        </motion.div>

        {/* content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar */}
          <div className="space-y-8 lg:col-span-1">
            
            {/* Stats */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8">
               <h3 className="text-white text-[10px] font-bold uppercase tracking-widest mb-8 border-b border-slate-800 pb-4">Activity Signal</h3>
               <div className="space-y-8">
                 {profileData.stats.map((stat, i) => (
                    <div key={i} className="flex items-center gap-5">
                      <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-500 shadow-inner">
                        {stat.icon}
                      </div>
                      <div>
                        <div className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-0.5">{stat.label}</div>
                        <div className="text-white font-black text-xl tracking-tight leading-none">{stat.value}</div>
                      </div>
                    </div>
                 ))}
               </div>
            </div>

            {/* Contact */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8">
               <h3 className="text-white text-[10px] font-bold uppercase tracking-widest mb-8 border-b border-slate-800 pb-4">Direct Network</h3>
               <div className="space-y-6">
                 <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-slate-700 group-hover:text-blue-500 transition-colors">
                       <Mail size={16} />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-slate-600 text-[8px] font-bold uppercase tracking-widest">Email</span>
                       <span className="text-slate-300 text-xs font-medium font-mono lowercase">{profileData.email}</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-slate-700 group-hover:text-blue-500 transition-colors">
                       <Phone size={16} />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-slate-600 text-[8px] font-bold uppercase tracking-widest">Phone</span>
                       <span className="text-slate-300 text-xs font-medium">+91 ••••• ••124</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Main Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Professional Overview */}
            <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 sm:p-14 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none transition-all duration-700 group-hover:bg-blue-600/10" />
               
               <h3 className="text-white text-[10px] font-bold uppercase tracking-widest mb-8 flex items-center gap-3">
                  <Zap size={14} className="text-blue-500" /> Professional Overview
               </h3>

               {isEditing ? (
                  <textarea 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-slate-400 text-lg leading-relaxed focus:outline-none focus:border-blue-600 transition-colors shadow-inner min-h-[160px]"
                    defaultValue={profileData.bio}
                  />
               ) : (
                  <p className="text-slate-400 text-xl leading-relaxed italic font-medium relative z-10">
                    "{profileData.bio}"
                  </p>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-slate-800/60">
                  <div className="space-y-4">
                     <h4 className="text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <Shield size={14} className="text-blue-500" /> Account Trust
                     </h4>
                     <p className="text-slate-500 text-xs leading-relaxed lowercase italic font-medium">
                        Profile verification level: <span className="text-blue-600">Enterprise Grade</span>. All documentation has been manually reviewed by Flexora architecture.
                     </p>
                  </div>
                  <div className="space-y-4">
                     <h4 className="text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <Award size={14} className="text-blue-500" /> Platform Tier
                     </h4>
                     <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 bg-slate-950 rounded-full overflow-hidden shadow-inner">
                           <div className="h-full w-[85%] bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
                        </div>
                        <span className="text-white font-black text-xs font-mono">85%</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Role-Specific Secondary Cards */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-[32px] p-10">
               <h3 className="text-white text-[10px] font-bold uppercase tracking-widest mb-10 border-b border-slate-800/60 pb-4 inline-block">
                  {isProvider ? "Active Marketplace Signal" : "Recent Service Nodes"}
               </h3>
               
               <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-950 border border-slate-900 rounded-2xl hover:border-blue-600/30 transition-all cursor-pointer group">
                       <div className="flex items-center gap-5">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-700 group-hover:text-blue-500 transition-colors">
                             {isProvider ? <Building2 size={16} /> : <Briefcase size={16} />}
                          </div>
                          <div>
                             <div className="text-white font-bold text-xs uppercase tracking-tight mb-1 group-hover:text-blue-500 transition-all">
                                {isProvider ? "Event Server Node Deployment" : "Premium Logistics Specialist"}
                             </div>
                             <div className="text-slate-600 text-[9px] font-bold uppercase tracking-widest font-mono">
                                Kerala Regional Hub • Completed March 12
                             </div>
                          </div>
                       </div>
                       <div className="text-blue-600 text-[10px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          View Signal
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="py-12 border-t border-slate-900 text-center opacity-40">
        <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} Flexora Platform Architecture. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default UserProfilePage;