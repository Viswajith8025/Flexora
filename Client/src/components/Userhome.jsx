import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from "../services/api";
import toast from 'react-hot-toast';
import JobCard from "./Jobcard";
import JobDetailModal from "./JobDetailModal";

import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Star,
  Bookmark,
  Filter,
  ChevronRight,
  ArrowRight,
  Briefcase,
  Users,
  Building2,
  Zap,
  Shield,
  Award,
  TrendingUp,
  CheckCircle,
  Play,
  Menu,
  X,
  Heart,
  Share2,
  Eye,
  Globe,
  Smartphone,
  Headphones,
  Mail,
  Phone,
  MessageCircle,
  Sparkles,
  Activity,
  Target,
  LayoutDashboard,
  Bell,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import logo from '../assets/logooo.png';
import SlideButton from './SlideButton';
import NotificationDropdown from './NotificationDropdown';

// ─── Application Success Screen ───────────────────────────────────────────────
const ApplicationSuccessModal = ({ job, onClose }) => (
  <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm"
      onClick={onClose}
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 10 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[40px] p-10 sm:p-14 text-center shadow-2xl overflow-hidden"
    >
      <div className="relative inline-flex items-center justify-center mb-10">
        <div className="w-20 h-20 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <CheckCircle size={40} className="text-green-500" />
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.2, ease: [0.16, 1, 0.3, 1] }}>
        <p className="flex-meta text-green-500 uppercase mb-3">Application Confirmed</p>
        <h2 className="flex-title-sm mb-2">{job?.title}</h2>
        <p className="flex-label text-slate-500 mb-10 italic">at {job?.company}</p>

        <div className="flex-card bg-slate-950/50 p-8 mb-10 text-left border-dashed">
          <p className="flex-meta uppercase mb-8">What happens next</p>

          <div className="relative">
            <div className="absolute left-[18px] top-6 bottom-6 w-px bg-slate-900" />

            <div className="space-y-8">
              { [
                { icon: CheckCircle, label: "Application Received", sub: "Your credentials have been securely transmitted", status: "done", color: "text-green-500" },
                { icon: Eye, label: "Under Review", sub: "Employer will verify within 48 hours", status: "active", color: "text-blue-500" },
                { icon: Target, label: "Interview Intent", sub: "Notifications will appear in your dashboard", status: "pending", color: "text-slate-800" },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-5 relative">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 z-10 ${
                    step.status === 'done'
                      ? 'bg-green-500/10 border-green-500/30'
                      : step.status === 'active'
                      ? 'bg-blue-500/10 border-blue-500/30'
                      : 'bg-slate-950 border-slate-900'
                  }`}>
                    <step.icon size={16} className={step.color} />
                  </div>
                  <div className="pt-0.5">
                    <p className={`flex-label ${step.status === 'pending' ? 'text-slate-700' : 'text-white'}`}>{step.label}</p>
                    <p className="flex-meta lowercase mt-1">{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <SlideButton
            onClick={onClose}
            className="flex-1 !py-4"
          >
            Got it
          </SlideButton>
        </div>
      </motion.div>
    </motion.div>
  </div>
);

const FlexoraDashboard = () => {
  const { user: currentUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [myApplications, setMyApplications] = useState([]);
  const [isApplicationsLoading, setIsApplicationsLoading] = useState(false);
  const [myPostedJobs, setMyPostedJobs] = useState([]);
  const [isPostedJobsLoading, setIsPostedJobsLoading] = useState(false);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [selectedApplicationDetails, setSelectedApplicationDetails] = useState(null);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [selectedJobForDetail, setSelectedJobForDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Application Handling
  const navigate = useNavigate();
  const [loadingApplyId, setLoadingApplyId] = useState(null);
  const [successJob, setSuccessJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  useEffect(() => {
    if (currentUser) {
      const applied = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      setAppliedJobs(new Set(applied));
      fetchDashboardData();
      
      // Fetch real recommended jobs with safety net
      async function fetchRecommended() {
         try {
            const { data } = await api.getJobs({ limit: 3 });
            if (data && Array.isArray(data)) {
               setFeaturedJobs(data);
            } else {
               setFeaturedJobs([]);
            }
         } catch (err) {
            console.error("Marketplace Fetch Error:", err.message);
            setFeaturedJobs([]);
         }
      }

      fetchRecommended();
    }
  }, [currentUser]);

  const handleApply = useCallback(async (job) => {
    if (!currentUser) {
      toast.error("Sign in to apply for jobs");
      navigate("/flexoraauth");
      return;
    }

    const jobId = job.id || job._id;
    if (appliedJobs.has(jobId)) {
      toast("You've already applied for this job", { icon: "ℹ️" });
      return;
    }

    setLoadingApplyId(jobId);
    try {
      await api.applyForJob(jobId);

      // Sync local state
      const newApplied = new Set(appliedJobs);
      newApplied.add(jobId);
      setAppliedJobs(newApplied);
      localStorage.setItem('appliedJobs', JSON.stringify([...newApplied]));

      setSuccessJob(job);
      fetchDashboardData(); // Refresh apps list
    } catch (error) {
      const msg = error.response?.data?.msg || 'Failed to submit application';
      if (msg.toLowerCase().includes('already')) {
        const newApplied = new Set(appliedJobs);
        newApplied.add(jobId);
        setAppliedJobs(newApplied);
        localStorage.setItem('appliedJobs', JSON.stringify([...newApplied]));
        toast.success("Syncing previous application...");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoadingApplyId(null);
    }
  }, [currentUser, appliedJobs, navigate]);

  const fetchDashboardData = async () => {
    setIsApplicationsLoading(true);
    if (currentUser?.role === 'job_provider') setIsPostedJobsLoading(true);
    
    try {
      const { data: apps } = await api.getMyApplications();
      setMyApplications(apps);
      
      if (currentUser?.role === 'job_provider') {
        const { data: jobs } = await api.getProviderJobs();
        setMyPostedJobs(jobs);
      }
    } catch (error) {
      console.error("Dashboard Data Sync Error:", error);
    } finally {
      setIsApplicationsLoading(false);
      setIsPostedJobsLoading(false);
    }
  };

  // Seeker Stats Calculation
  const seekerStats = useMemo(() => {
    return {
      total: myApplications.length,
      pending: myApplications.filter(a => a.status === 'pending').length,
      accepted: myApplications.filter(a => a.status === 'accepted').length,
      rejected: myApplications.filter(a => a.status === 'rejected').length
    };
  }, [myApplications]);

  // Provider Stats Calculation
  const providerStats = useMemo(() => {
    return {
      active: myPostedJobs.length,
      applicants: myPostedJobs.reduce((acc, job) => acc + (job.applicants?.length || 0), 0),
      hired: myPostedJobs.reduce((acc, job) => acc + (job.applicants?.filter(a => a.status === 'accepted').length || 0), 0)
    };
  }, [myPostedJobs]);

  const handleUpdateApplicantStatus = async (jobId, userId, status) => {
     try {
        await api.updateApplicationStatus(jobId, userId, status);
        toast.success(`Candidate ${status === 'accepted' ? 'Hired' : 'Declined'}`);
        fetchDashboardData();
     } catch (err) {
        toast.error("Failed to update status");
     }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <nav className="fixed top-0 w-full z-[100] px-6 h-20 flex justify-between items-center bg-slate-950/80 border-b border-slate-900 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Flexora" className="h-16 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-white font-bold text-[10px] uppercase tracking-widest border-b-2 border-blue-600 pb-1 cursor-default">Dashboard</span>
            {currentUser?.role === 'job_provider' && (
              <Link to="/post-job" className="text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors">Post Job</Link>
            )}
            {currentUser?.role === 'admin' && (
              <Link to="/flexora-admin" className="text-blue-500 font-bold text-[10px] uppercase tracking-widest hover:text-blue-400 transition-colors">Admin Hub</Link>
            )}
            <Link to="/about" className="text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors">How it Works</Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <NotificationDropdown />
          
          <div className="flex items-center gap-3 pl-6 border-l border-slate-900">
             <div className="text-right hidden sm:block">
                <div className="flex-label text-white mb-1">{currentUser?.name || "Member"}</div>
                <div className="flex-meta capitalize text-blue-500 font-bold">
                   {currentUser?.role === 'job_provider' ? 'Provider' : 
                    currentUser?.role === 'job_seeker' ? 'Seeker' : 
                    currentUser?.role?.replace('_', ' ') || 'User'}
                </div>
             </div>
             <div className="group relative">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold cursor-pointer">
                   {currentUser?.name?.[0] || 'U'}
                </div>
                <div className="absolute right-0 top-12 w-48 bg-slate-900 border border-slate-800 rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl z-[110]">
                   <Link to="/userprofile" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 rounded-xl flex-label transition-colors mb-1"><Users size={14} /> Profile Settings</Link>
                   <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-500/10 text-red-500 rounded-xl flex-label transition-colors"><LogOut size={14} /> Logout Session</button>
                </div>
             </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24">
        {/* Welcome Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 text-blue-500 flex-label rounded-lg flex items-center gap-2">
                  <LayoutDashboard size={12} /> Dashboard
               </div>
            </div>
            <h1 className="flex-title-md">
               Welcome back, <span className="text-slate-500 italic font-medium">{currentUser?.name?.split(' ')[0] || 'there'}</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
             <div className="flex items-center gap-2">
                <div className="pulse-dot" />
                <span className="text-white text-xs font-bold uppercase tracking-widest">Online</span>
             </div>
          </div>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {currentUser?.role === 'job_provider' ? (
            <React.Fragment key="provider-stats">
              <div className="flex-card flex-card-padding">
                <div className="flex-label mb-5 flex items-center gap-2">
                   <Target size={14} className="text-blue-500" /> Active Listings
                </div>
                <div className="text-4xl font-black text-white leading-none">{providerStats.active}</div>
              </div>
              <div className="flex-card flex-card-padding">
                <div className="flex-label mb-5 flex items-center gap-2">
                   <Users size={14} className="text-blue-500" /> Total Applicants
                </div>
                <div className="text-4xl font-black text-white leading-none">{providerStats.applicants}</div>
              </div>
              <div className="flex-card flex-card-padding">
                <div className="flex-label mb-5 flex items-center gap-2">
                   <CheckCircle size={14} className="text-green-500" /> Hired Candidates
                </div>
                <div className="text-4xl font-black text-white leading-none">{providerStats.hired}</div>
              </div>
              <div className="flex-card flex-card-padding">
                <div className="flex-label mb-5 flex items-center gap-2">
                   <Activity size={14} className="text-purple-500" /> Hiring Rate
                </div>
                <div className="text-4xl font-black text-white leading-none">
                  {providerStats.active ? Math.round((providerStats.hired / providerStats.active) * 10) / 10 : 0}
                  <span className="text-slate-700 text-lg ml-1 uppercase">Hires/Job</span>
                </div>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment key="seeker-stats">
              <div className="flex-card flex-card-padding group">
                <div className="flex-label mb-5 flex items-center gap-2">
                   <Briefcase size={14} className="text-blue-500" /> Total Applications
                </div>
                <div className="text-4xl font-black text-white leading-none group-hover:text-blue-500 transition-colors">{seekerStats.total}</div>
              </div>
              <div className="flex-card flex-card-padding">
                <div className="flex-label mb-5 flex items-center gap-2">
                   <Clock size={14} className="text-amber-500" /> Under Review
                </div>
                <div className="text-4xl font-black text-white leading-none">{seekerStats.pending}</div>
              </div>
              <div className="flex-card flex-card-padding border-b-green-500/20">
                <div className="flex-label mb-5 flex items-center gap-2">
                   <CheckCircle size={14} className="text-green-500" /> Accepted
                </div>
                <div className="text-4xl font-black text-white leading-none">{seekerStats.accepted}</div>
              </div>
              <div className="flex-card flex-card-padding">
                <div className="flex-label mb-5 flex items-center gap-2">
                   <TrendingUp size={14} className="text-blue-500" /> Match Efficiency
                </div>
                <div className="text-4xl font-black text-white leading-none">
                  {seekerStats.total ? Math.round((seekerStats.accepted / seekerStats.total) * 100) : 0}<span className="text-slate-700 text-lg ml-1">%</span>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Primary Feed */}
           <div className="lg:col-span-2 space-y-12">
              
              {/* Employer Hub (Provider View) */}
              {currentUser?.role === 'job_provider' && (
                 <section>
                    <div className="flex-section-header">
                       <h3 className="flex-label text-white flex items-center gap-2">
                          <Shield size={14} className="text-blue-500" /> Your Jobs
                       </h3>
                       <SlideButton to="/post-job" className="!px-6 !py-2.5 !text-[10px]">
                          Post a Job
                       </SlideButton>
                    </div>

                    {isPostedJobsLoading ? (
                       <div className="flex justify-center py-20">
                          <div className="w-8 h-8 border-2 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
                       </div>
                    ) : myPostedJobs.length === 0 ? (
                       <div className="flex-card min-h-[240px] border-dashed flex flex-col items-center justify-center p-12 text-center">
                          <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mb-6">
                             <Briefcase className="text-slate-800" size={32} />
                          </div>
                          <p className="text-slate-500 text-sm font-medium italic mb-2">You haven't posted any jobs yet.</p>
                          <p className="text-slate-700 text-xs mb-8">Your listings will show up here.</p>
                          <SlideButton to="/post-job" className="!px-8 !py-4">
                             Post Your First Job
                          </SlideButton>
                       </div>
                    ) : (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {myPostedJobs.map((job) => (
                             <JobCard
                                key={job._id || job.id}
                                job={job}
                                onClick={() => {
                                   setSelectedJobForDetail(job);
                                   setIsDetailModalOpen(true);
                                }}
                                customAction={
                                   <div className="flex flex-col gap-2 w-full">
                                      {job.applicants?.length > 0 && (
                                         <div className="flex-meta text-blue-500 text-center mb-1 bg-blue-500/5 py-1.5 rounded-lg border border-blue-500/10">
                                            {job.applicants.length} Applicants
                                         </div>
                                      )}
                                      <button 
                                         onClick={() => {
                                            setSelectedJobForApplicants(job);
                                            setIsApplicantsModalOpen(true);
                                         }}
                                         className="w-full flex-button-secondary"
                                      >
                                         Manage Applicants
                                      </button>
                                   </div>
                                }
                             />
                          ))}
                       </div>
                    )}
                 </section>
              )}

              {/* My Applications (Job Seeker View) */}
              {currentUser?.role === 'job_seeker' && (
                <section>
                   <div className="flex-section-header">
                      <h3 className="flex-label text-white flex items-center gap-2">
                         <Activity size={14} className="text-blue-500" /> My Applications
                      </h3>
                      <div className="flex-meta text-slate-600">
                         Last updated {new Date().toLocaleDateString()}
                      </div>
                   </div>

                   {/* ... existing application logic ... */}
                   {isApplicationsLoading ? (
                      <div className="flex justify-center py-20">
                         <div className="w-8 h-8 border-2 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
                      </div>
                   ) : myApplications.length === 0 ? (
                      <div className="flex-card min-h-[240px] border-dashed flex flex-col items-center justify-center p-12 text-center">
                         <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mb-6">
                            <Target className="text-slate-800" size={32} />
                         </div>
                         <p className="text-slate-500 text-sm font-medium italic mb-2">You haven't applied to any jobs yet.</p>
                         <p className="text-slate-700 text-xs mb-8">Find something that fits and hit Apply.</p>
                          <SlideButton to="/jobs" className="!px-8 !py-4">
                             Browse Jobs
                          </SlideButton>
                      </div>
                   ) : (
                      <div className="space-y-3">
                         {myApplications.map((app, i) => (
                            <motion.div
                               key={app._id || `app-${i}`}
                               initial={{ opacity: 0, y: 10 }}
                               animate={{ opacity: 1, y: 0 }}
                               className="interactive-row group"
                            >
                               <div className="flex items-center gap-5 flex-1 overflow-hidden">
                                  <div className="w-11 h-11 rounded-xl bg-slate-950 flex items-center justify-center text-blue-500 border border-slate-800 shrink-0">
                                     <Briefcase size={18} />
                                  </div>
                                  <div className="overflow-hidden">
                                     <h4 className="text-white font-bold text-sm tracking-tight truncate leading-tight mb-1">{app.title || "Job Application"}</h4>
                                     <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1.5 flex-meta"><Clock size={11} className="text-blue-500" /> Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                                     </div>
                                  </div>
                               </div>

                               <div className="flex items-center gap-4 shrink-0">
                                  <div className={`px-4 py-1.5 rounded-lg flex-meta border shadow-sm ${
                                     app.status === 'accepted' 
                                     ? "bg-green-600/10 text-green-500 border-green-500/20" 
                                     : app.status === 'rejected' 
                                     ? "bg-red-600/10 text-red-500 border-red-500/20" 
                                     : "bg-blue-600/10 text-blue-500 border-blue-500/20"
                                  }`}>
                                     {app.status === 'accepted' ? 'Hired' : app.status === 'rejected' ? 'Not selected' : 'In review'}
                                  </div>
                                  <button 
                                     onClick={() => setSelectedApplicationDetails(app)}
                                     className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-xl text-slate-500 hover:text-white transition-colors"
                                  >
                                     <ArrowRight size={18} />
                                  </button>
                               </div>
                            </motion.div>
                         ))}
                      </div>
                   )}
                </section>
              )}

              {/* Recommended Jobs (Seeker Only) */}
              {currentUser?.role === 'job_seeker' && (
                <section>
                   <div className="flex-section-header">
                      <h3 className="flex-label text-white flex items-center gap-2">
                         <Sparkles size={14} className="text-blue-500" /> Recommended For You
                      </h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {featuredJobs.map((job, i) => (
                         <JobCard
                            key={job._id || job.id || `featured-${i}`}
                            job={job}
                            onClick={() => {
                               setSelectedJobForDetail(job);
                               setIsDetailModalOpen(true);
                            }}
                            onApply={handleApply}
                            isApplying={loadingApplyId === (job._id || job.id)}
                            customAction={appliedJobs.has(job._id || job.id) ? (
                               <div className="flex-meta text-green-500 bg-green-500/10 px-4 py-1.5 border border-green-500/20 rounded-lg italic text-center w-full">
                                  Already Applied
                               </div>
                            ) : undefined}
                         />
                      ))}
                   </div>
                </section>
              )}
           </div>

           {/* Sidebar Intel */}
           <div className="space-y-8">
              {/* Platform Status */}
              <div className="flex-card flex-card-padding">
                 <h3 className="flex-label text-white flex items-center gap-2 mb-8 pb-4 border-b border-slate-800">
                    <Activity size={14} className="text-blue-500" /> Your Stats
                 </h3>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center flex-meta">
                       <span className="text-slate-500">Member Rating</span>
                       <span className="text-amber-500 flex items-center gap-1">4.8 <Star size={10} className="fill-amber-500" /></span>
                    </div>
                    <div className="flex justify-between items-center flex-meta">
                       <span className="text-slate-500">Response Speed</span>
                       <span className="text-blue-500">~ 24 Hours</span>
                    </div>
                    <div className="flex justify-between items-center flex-meta">
                       <span className="text-slate-500">Profile Completion</span>
                       <span className="text-white">92%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: '92%' }} />
                    </div>
                 </div>
              </div>

              {/* Saved Jobs Summary */}
              <div className="flex-card flex-card-padding">
                 <h3 className="flex-label text-white flex items-center gap-2 mb-8 pb-4 border-b border-slate-800">
                    <Bookmark size={14} className="text-blue-500" /> Saved Jobs
                 </h3>
                 <div className="text-center py-10">
                    <Heart className="h-8 w-8 text-slate-800 mx-auto mb-4" />
                    <p className="flex-meta text-slate-500 italic lowercase">No saved jobs yet.</p>
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* Applicant Review Modal (Provider View) */}
      <AnimatePresence>
         {isApplicantsModalOpen && selectedJobForApplicants && (
            <div key="applicants-modal-overlay" className="fixed inset-0 z-[200] flex items-center justify-center p-6">
               <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={() => setIsApplicantsModalOpen(false)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" />
               <motion.div key="modal-content" initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }} className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl p-8 sm:p-12 flex flex-col max-h-[85vh]">
                  <div className="flex justify-between items-start mb-10">
                     <div>
                        <h2 className="flex-title-sm mb-2">Applicants for <span className="text-blue-500">{selectedJobForApplicants.title}</span></h2>
                        <p className="flex-meta text-slate-500 italic">Review and hire from the list below</p>
                     </div>
                     <button onClick={() => setIsApplicantsModalOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-xl text-slate-500 transition-all"><X size={20} /></button>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                     {!selectedJobForApplicants.applicants || selectedJobForApplicants.applicants.length === 0 ? (
                        <div className="py-20 text-center">
                           <Users className="h-12 w-12 text-slate-800 mx-auto mb-6" />
                           <p className="text-slate-500 font-medium italic lowercase">No one has applied yet. Check back soon.</p>
                        </div>
                     ) : (
                        <div className="space-y-4">
                            {selectedJobForApplicants.applicants.map((applicant, i) => (
                               <div key={applicant.user?._id || i} className="flex-card p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-slate-700 transition-colors mb-4 last:mb-0">
                                  <div className="flex items-center gap-6">
                                     <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-600/10 shrink-0">
                                        {applicant.user?.name?.[0] || 'A'}
                                     </div>
                                     <div className="min-w-0">
                                        <h4 className="text-lg font-bold text-white tracking-tight mb-1 leading-tight truncate">{applicant.user?.name || "Candidate"}</h4>
                                        <div className="flex items-center gap-3 flex-meta">
                                           <span className="text-blue-500 truncate">{applicant.user?.email || "No email provided"}</span>
                                           <span className="text-slate-800">|</span>
                                           <span className="flex items-center gap-1 shrink-0"><Star size={10} className="fill-amber-500 text-amber-500" /> {applicant.user?.rating || '4.9'} Rating</span>
                                        </div>
                                     </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-3 w-full md:w-auto">
                                     <button 
                                        onClick={() => handleUpdateApplicantStatus(selectedJobForApplicants._id, applicant.user?._id, 'accepted')}
                                        className={`flex-1 md:flex-none !px-8 !py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                           applicant.status === 'accepted' 
                                           ? "bg-green-600 text-white shadow-lg shadow-green-600/20" 
                                           : "bg-slate-900 border border-slate-800 text-slate-500 hover:text-white hover:border-slate-700"
                                        }`}
                                     >
                                        {applicant.status === 'accepted' ? 'Hired' : 'Hire'}
                                     </button>
                                     <button 
                                        onClick={() => handleUpdateApplicantStatus(selectedJobForApplicants._id, applicant.user?._id, 'rejected')}
                                        className={`flex-1 md:flex-none !px-8 !py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                           applicant.status === 'rejected' 
                                           ? "bg-red-600 text-white shadow-lg shadow-red-600/20" 
                                           : "bg-slate-900 border border-slate-800 text-slate-500 hover:text-white hover:border-slate-700"
                                        }`}
                                     >
                                        {applicant.status === 'rejected' ? 'Declined' : 'Decline'}
                                     </button>
                                  </div>
                               </div>
                            ))}
                         </div>
                     )}
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* Application Detail Modal (Seeker View) */}
      <AnimatePresence>
         {selectedApplicationDetails && (
            <div key="application-detail-overlay" className="fixed inset-0 z-[200] flex items-center justify-center p-6">
               <motion.div key="detail-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={() => setSelectedApplicationDetails(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" />
               <motion.div key="detail-modal" initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }} className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl p-10 sm:p-14">
                  <div className="flex justify-between items-start mb-10">
                     <div className={`px-4 py-1.5 rounded-lg flex-meta border ${
                        selectedApplicationDetails.status === 'accepted' 
                        ? "bg-green-600/10 text-green-500 border-green-500/20" 
                        : selectedApplicationDetails.status === 'rejected'
                        ? "bg-red-600/10 text-red-500 border-red-500/20"
                        : "bg-blue-600/10 text-blue-500 border-blue-500/20"
                     }`}>
                        {selectedApplicationDetails.status}
                     </div>
                     <button onClick={() => setSelectedApplicationDetails(null)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-xl text-slate-500 transition-all"><X size={20} /></button>
                  </div>

                  <h2 className="flex-title-sm mb-4 leading-tight">{selectedApplicationDetails.title}</h2>
                  <p className="flex-meta mb-10 flex items-center gap-2">
                     <Clock size={13} className="text-blue-500" /> Applied on {new Date(selectedApplicationDetails.appliedAt).toLocaleDateString()}
                  </p>

                  <div className="flex-card flex-card-padding bg-slate-950/50 mb-10">
                     <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-900">
                        <span className="flex-label">Status</span>
                        <span className={`font-black uppercase tracking-widest text-xs ${
                           selectedApplicationDetails.status === 'accepted' ? "text-green-500" : selectedApplicationDetails.status === 'rejected' ? "text-red-500" : "text-blue-500"
                        }`}>
                           {selectedApplicationDetails.status === 'accepted' ? 'Hired — Congrats!' : selectedApplicationDetails.status === 'rejected' ? 'Not Selected' : 'In Review'}
                        </span>
                     </div>
                     <p className="text-slate-500 text-sm leading-relaxed italic">
                        {selectedApplicationDetails.status === 'accepted'
                           ? 'You got the job! The employer will reach out to you via the chat or contact details you provided.'
                           : selectedApplicationDetails.status === 'rejected'
                           ? 'This position has been filled. Keep applying — the right job is still out there.'
                           : 'The employer is reviewing your profile. You\'ll be notified here when there\'s an update.'}
                     </p>
                  </div>

                  <button 
                     onClick={() => setSelectedApplicationDetails(null)}
                     className="w-full flex-button-secondary py-4"
                  >
                     Close
                  </button>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
      
      {/* Job Detail Modal (Shared) */}
      <JobDetailModal
         job={selectedJobForDetail}
         isOpen={isDetailModalOpen}
         onClose={() => setIsDetailModalOpen(false)}
         onApply={handleApply}
         isApplying={loadingApplyId === (selectedJobForDetail?._id || selectedJobForDetail?.id)}
         isProviderView={currentUser?.role === 'job_provider'}
      />
    </div>
  );
};

export default FlexoraDashboard;