import React, { useEffect, useMemo, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import ChatBox from "../../components/Chatbox";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  DollarSign,
  Star,
  Filter,
  ArrowRight,
  Briefcase,
  CheckCircle,
  Heart,
  X,
  Clock,
  Send,
  Eye,
  Loader2,
  AlertCircle,
  BookmarkCheck,
  Bell,
  User
} from "lucide-react";
import logo from "../../assets/logooo.png";
import JobCard from "../../components/Jobcard";
import SlideButton from "../../components/SlideButton";
import AuthModal from "../../components/AuthModal";
import FilterSheet from "../../components/FilterSheet";
import NotificationDropdown from "../../components/NotificationDropdown";
import JobDetailModal from "../../components/JobDetailModal";
import { useAuth } from "../../context/AuthContext";

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
      {/* Success Icon */}
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

        {/* Status Timeline */}
        <div className="flex-card bg-slate-950/50 p-8 mb-10 text-left border-dashed">
          <p className="flex-meta uppercase mb-8">What happens next</p>

          <div className="relative">
            <div className="absolute left-[18px] top-6 bottom-6 w-px bg-slate-900" />

            <div className="space-y-8">
              {[
                { icon: CheckCircle, label: "Application Received", sub: "Your credentials have been securely transmitted", status: "done", color: "text-green-500" },
                { icon: Eye, label: "Under Review", sub: "Employer will verify within 48 hours", status: "active", color: "text-blue-500" },
                { icon: Send, label: "Interview Intent", sub: "Notifications will appear in your dashboard", status: "pending", color: "text-slate-800" },
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
            to="/"
            className="flex-1 !py-4"
          >
            Back Home
          </SlideButton>
          <button
            onClick={onClose}
            className="flex-1 flex-button-secondary py-4"
          >
            Continue Browsing
          </button>
        </div>
      </motion.div>
    </motion.div>
  </div>
);

// Local JobDetailModal removed in favor of shared component

// ─── Main Jobs Page ───────────────────────────────────────────────────────────
const Jobs = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [loadingApplyId, setLoadingApplyId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [savedOnly, setSavedOnly] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [successJob, setSuccessJob] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Count active filters for badge
  const activeFilterCount = [
    searchQuery, locationFilter, categoryFilter !== 'all' ? categoryFilter : '', savedOnly ? '1' : ''
  ].filter(Boolean).length;

  useEffect(() => {
    fetchJobs();

    if (currentUser) {
      // Sync personal data from server for real-time accuracy
      const syncUserData = async () => {
        try {
          // Fetch real applications
          const { data: applications } = await api.getMyApplications();
          const appliedIds = new Set(applications.map(app => app.jobId));
          setAppliedJobs(appliedIds);
          localStorage.setItem('appliedJobs', JSON.stringify([...appliedIds]));

          // Saved jobs (keeping local for performance, but sync logic can be added)
          const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
          setSavedJobs(new Set(saved));
        } catch (error) {
          console.error("Auth Sync Error:", error);
        }
      };
      
      syncUserData();
    } else {
      setSavedJobs(new Set());
      setAppliedJobs(new Set());
    }
  }, [currentUser]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.getJobs();
      
      if (data && data.length > 0) {
        setJobs(data);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error('Connection issue. Refreshing list...');
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = useCallback(async (job) => {
    if (!currentUser) {
      navigate('/flexoraauth', { state: { from: '/jobs' } });
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

      // Mark as applied client-side
      const newApplied = new Set(appliedJobs);
      newApplied.add(jobId);
      setAppliedJobs(newApplied);
      localStorage.setItem('appliedJobs', JSON.stringify([...newApplied]));

      // Close detail modal, show success screen
      setSelectedJob(null);
      setSuccessJob(job);
    } catch (error) {
      const msg = error.response?.data?.msg || 'Failed to submit application';
      if (msg.toLowerCase().includes('already')) {
        // Already applied on backend — just mark it client-side silently
        const newApplied = new Set(appliedJobs);
        newApplied.add(jobId);
        setAppliedJobs(newApplied);
        localStorage.setItem('appliedJobs', JSON.stringify([...newApplied]));
        setSelectedJob(null);
        setSuccessJob(job);
      } else {
        toast.error(msg);
      }
    } finally {
      setLoadingApplyId(null);
    }
  }, [currentUser, appliedJobs, navigate]);

  const toggleSaveJob = useCallback((jobId) => {
    const newSaved = new Set(savedJobs);
    if (newSaved.has(jobId)) {
      newSaved.delete(jobId);
      toast("Removed from saved jobs", { icon: "🗑️" });
    } else {
      newSaved.add(jobId);
      toast.success("Job saved for later");
    }
    setSavedJobs(newSaved);
    localStorage.setItem('savedJobs', JSON.stringify([...newSaved]));
  }, [savedJobs]);

  const categories = [
    { id: "all", name: "All Sectors", icon: "🌐" },
    { id: "general", name: "General", icon: "📋" },
    { id: "events", name: "Events", icon: "🎪" },
    { id: "digital", name: "Digital", icon: "💻" },
    { id: "delivery", name: "Delivery", icon: "🚚" },
    { id: "retail", name: "Retail", icon: "🛒" },
    { id: "hospitality", name: "Hospitality", icon: "🍽️" },
    { id: "logistics", name: "Logistics", icon: "📦" },
    { id: "security", name: "Security", icon: "🛡️" },
    { id: "technical", name: "Technical", icon: "⚙️" },
    { id: "creative", name: "Creative", icon: "🎨" },
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = job.title?.toLowerCase().includes(q) || job.company?.toLowerCase().includes(q);
      const matchesLocation = !locationFilter || job.location?.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesCategory = categoryFilter === "all" || job.category?.toLowerCase() === categoryFilter.toLowerCase();
      const matchesJobType = !jobTypeFilter || job.jobType?.toLowerCase() === jobTypeFilter.toLowerCase();
      const matchesSaved = !savedOnly || savedJobs.has(job.id);
      return matchesSearch && matchesLocation && matchesCategory && matchesJobType && matchesSaved;
    });
  }, [jobs, searchQuery, locationFilter, categoryFilter, jobTypeFilter, savedJobs, savedOnly]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* SaaS Header */}
      <nav className="fixed top-0 w-full z-[100] px-6 h-20 flex justify-between items-center bg-slate-950/80 border-b border-slate-900 backdrop-blur-md">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Flexora" className="h-18 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">home</Link>
            <Link to="/about" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">about</Link>
            <Link to="/jobs" className="text-sm font-bold uppercase tracking-widest text-white transition-colors underline underline-offset-8 decoration-blue-500 decoration-2">jobs</Link>
            
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
                <button onClick={() => setIsAuthModalOpen(true)} className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">log in</button>
                <button onClick={() => setIsAuthModalOpen(true)} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">signup</button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24">
        {/* Page Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 text-blue-500 flex-label rounded-lg flex items-center gap-2">
                  <Briefcase size={12} /> Marketplace
               </div>
            </div>
            <h1 className="flex-title-md">
               Find Your <span className="text-slate-500 italic font-medium">Next Job</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
             {currentUser && appliedJobs.size > 0 && (
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-500 flex-label italic rounded-xl cursor-default">
                  <CheckCircle size={13} /> {appliedJobs.size} Active {appliedJobs.size === 1 ? 'Application' : 'Applications'}
                </div>
             )}
             <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 text-white flex-label rounded-xl hover:border-slate-700 transition-all relative"
             >
                <Filter size={14} /> Filter
                {activeFilterCount > 0 && (
                   <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 rounded-full text-[10px] flex items-center justify-center font-black shadow-lg">
                      {activeFilterCount}
                   </span>
                )}
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10">
          <aside className="hidden lg:block lg:col-span-1">
            <div className="flex-card flex-card-padding space-y-12 sticky top-28 bg-slate-900/50 backdrop-blur-sm">
              <div className="space-y-6">
                <div>
                  <label className="flex-label text-white mb-4 flex items-center gap-2">
                     <Search size={14} className="text-blue-500" /> Search
                  </label>
                  <input
                    type="text"
                    placeholder="Job title or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-3.5 flex-label text-white placeholder-slate-700 focus:outline-none focus:border-blue-600 transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="flex-label text-white mb-4 flex items-center gap-2">
                     <MapPin size={14} className="text-blue-500" /> Location
                  </label>
                  <input
                    type="text"
                    placeholder="City or district..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-3.5 flex-label text-white placeholder-slate-700 focus:outline-none focus:border-blue-600 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex-label text-white mb-6 block border-b border-slate-800 pb-2">Category</label>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                        categoryFilter === cat.id
                          ? "bg-blue-600/10 border border-blue-600/30 text-blue-500"
                          : "text-slate-500 hover:text-white hover:bg-slate-800/40 border border-transparent"
                      }`}
                    >
                      <span className="flex-meta uppercase">{cat.name}</span>
                      <span className="text-base">{cat.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex-meta uppercase text-slate-500 font-black mb-6 block border-b border-slate-800 pb-2">Working Arrangement</label>
                <div className="space-y-2">
                  {[
                    { id: "on-site", name: "On-site" },
                    { id: "remote", name: "Remote" },
                    { id: "hybrid", name: "Hybrid" },
                    { id: "freelance", name: "Freelance" }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setJobTypeFilter(prev => prev === type.id ? "" : type.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                        jobTypeFilter === type.id
                          ? "bg-blue-600/10 border-blue-600/30 text-blue-500"
                          : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <span className="flex-meta uppercase">{type.name}</span>
                      {jobTypeFilter === type.id && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-800">
                 <button
                   onClick={() => setSavedOnly(!savedOnly)}
                   className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all ${
                     savedOnly ? "bg-blue-600/10 border-blue-600/30 text-blue-500" : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                   }`}
                 >
                   <span className="flex-meta uppercase">Saved Only</span>
                   <Heart size={14} fill={savedOnly ? "currentColor" : "none"} className={savedOnly ? "text-blue-500" : "text-slate-700"} />
                 </button>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-28 sm:py-40 gap-4">
                <div className="w-10 h-10 border-2 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
                <p className="flex-meta uppercase">Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="flex-card border-dashed p-20 text-center">
                <AlertCircle size={36} className="text-slate-800 mx-auto mb-4" />
                <p className="flex-label text-slate-500 italic mb-8">No jobs found. Try a different search.</p>
                <button
                  onClick={() => { setSearchQuery(''); setLocationFilter(''); setCategoryFilter('all'); setSavedOnly(false); }}
                  className="text-blue-500 flex-label uppercase hover:text-blue-400"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredJobs.map((job) => {
                    const jobId = job.id || job._id;
                    const alreadyApplied = appliedJobs.has(jobId);
                    return (
                      <motion.div
                        key={jobId}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                      >
                        <JobCard
                          job={job}
                          onClick={() => setSelectedJob(job)}
                          onApply={handleApply}
                          isApplying={loadingApplyId === jobId}
                          customAction={alreadyApplied ? (
                            <div className="flex-meta text-green-500 bg-green-500/10 px-4 py-1.5 border border-green-500/20 rounded-lg italic">
                              Applied
                            </div>
                          ) : undefined}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedJob && (
          <JobDetailModal
            job={selectedJob}
            isOpen={!!selectedJob}
            onClose={() => setSelectedJob(null)}
            onApply={handleApply}
            isApplying={loadingApplyId === (selectedJob.id || selectedJob._id)}
            isSaved={savedJobs.has(selectedJob.id || selectedJob._id)}
            onSave={toggleSaveJob}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successJob && (
          <ApplicationSuccessModal
            job={successJob}
            onClose={() => setSuccessJob(null)}
          />
        )}
      </AnimatePresence>

      <FilterSheet 
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        jobTypeFilter={jobTypeFilter}
        setJobTypeFilter={setJobTypeFilter}
        categories={categories}
        resultCount={filteredJobs.length}
        onClear={() => {
          setSearchQuery("");
          setLocationFilter("");
          setCategoryFilter("all");
          setJobTypeFilter("");
          setSavedOnly(false);
          toast("Filters Cleared", { icon: "🧹" });
        }}
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      <ChatBox />
    </div>
  );
};

export default Jobs;
