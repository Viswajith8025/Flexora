import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  Clock, 
  Loader2,
  AlertCircle,
  Eye,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  Inbox
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logooo.png";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, accepted, rejected, applied

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.getMyApplications();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load your applications");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredApps = applications.filter(app => 
    filter === "all" ? true : app.status === filter
  );

  const stats = {
    total: applications.length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    pending: applications.filter(a => a.status === 'applied').length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
        <p className="flex-meta uppercase">Retrieving your status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20">
      {/* SaaS Header */}
      <nav className="fixed top-0 w-full z-[100] px-6 h-20 flex justify-between items-center bg-slate-950/80 border-b border-slate-900 backdrop-blur-md">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Flexora" className="h-18 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">home</Link>
            <Link to="/jobs" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">marketplace</Link>
            <Link to="/my-applications" className="text-sm font-bold uppercase tracking-widest text-white transition-colors underline underline-offset-8 decoration-blue-500 decoration-2">my status</Link>
            <div className="h-6 w-px bg-slate-800" />
            <Link to="/flexoraauth" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">profile</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-32">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 text-blue-500 flex-label rounded-lg flex items-center gap-2">
                <TrendingUp size={12} /> Seeker Dashboard
              </div>
            </div>
            <h1 className="flex-title-md">
              Application <span className="text-slate-500 italic font-medium">Tracking</span>
            </h1>
          </div>

          <div className="flex p-1 bg-slate-900/50 rounded-xl border border-slate-800 backdrop-blur-sm">
             {["all", "applied", "accepted", "rejected"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === f ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {f === 'applied' ? 'pending' : f}
                </button>
             ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            { label: "Active Pursuits", val: stats.total, icon: Briefcase, color: "text-blue-500" },
            { label: "Total Recalls", val: stats.accepted, icon: CheckCircle, color: "text-green-500" },
            { label: "Awaiting Feedback", val: stats.pending, icon: Clock, color: "text-slate-700" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              className="flex-card p-8 border-dashed flex items-center justify-between"
            >
              <div>
                <p className="flex-meta uppercase mb-2">{stat.label}</p>
                <span className="text-4xl font-black text-white">{stat.val}</span>
              </div>
              <stat.icon size={32} className={stat.color} />
            </motion.div>
          ))}
        </div>

        {/* Applications Display */}
        {filteredApps.length === 0 ? (
          <div className="flex-card border-dashed p-20 text-center">
             <Inbox size={36} className="text-slate-800 mx-auto mb-4" />
             <p className="flex-label text-slate-500 italic mb-8">No applications found in this category.</p>
             <Link to="/jobs" className="text-blue-500 flex-label uppercase hover:text-blue-400 flex items-center justify-center gap-2">
                Browse Marketplace <ArrowRight size={14} />
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredApps.map((app) => (
                <motion.div
                  key={app.jobId}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-card p-10 group hover:border-slate-700 transition-all flex flex-col"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-900 flex items-center justify-center text-blue-500 shadow-inner group-hover:border-blue-600/30 transition-all">
                       <Briefcase size={24} />
                    </div>
                    <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${
                      app.status === 'accepted' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                      app.status === 'rejected' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                      'bg-slate-900 border-slate-800 text-slate-500'
                    }`}>
                      {app.status === 'applied' ? <Clock size={12} /> : 
                       app.status === 'accepted' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {app.status === 'applied' ? 'pending' : app.status}
                    </div>
                  </div>

                  <h3 className="flex-title-sm mb-2">{app.title}</h3>
                  <p className="flex-label text-blue-500 mb-8 italic">at {app.company}</p>

                  <div className="space-y-4 mb-10">
                     <div className="flex items-center gap-3 py-1 text-slate-500">
                        <MapPin size={14} className="text-blue-500" />
                        <span className="flex-meta lowercase">{app.location}</span>
                     </div>
                     <div className="flex items-center gap-3 py-1 text-slate-500">
                        <Calendar size={14} className="text-blue-500" />
                        <span className="flex-meta lowercase">Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                     </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-900/50 flex items-center justify-between">
                     <span className="flex-label text-white font-black">{app.compensation}</span>
                     <Link 
                       to={`/jobs`} 
                       className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:border-blue-600 transition-all"
                     >
                       <Eye size={16} />
                     </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyApplications;
