import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { 
  Briefcase, 
  Calendar, 
  Users, 
  ChevronRight, 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  Loader2,
  AlertCircle,
  Eye,
  Settings,
  MoreVertical,
  CheckCircle,
  CreditCard,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logooo.png";
import JobDetailModal from "../../components/JobDetailModal";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const MyJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobForDetail, setSelectedJobForDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [activePayingJob, setActivePayingJob] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastTransactionId, setLastTransactionId] = useState("");

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.getMyJobs();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load your listings");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (jobId) => {
    if (isProcessingPayment) return; // Prevention of double submit (Bank-grade)

    try {
      setIsProcessingPayment(true);
      setActivePayingJob(jobId);

      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Check your internet connection.");
        setIsProcessingPayment(false);
        setActivePayingJob(null);
        return;
      }

      // 1. Create Order on Backend
      const { data: order } = await api.createPaymentOrder(jobId);

      // 2. Open Razorpay Modal
      const options = {
        key: order.key_id, 
        amount: order.amount,
        currency: order.currency,
        name: "Flexora Premium",
        description: "Job Promotion Fee",
        image: logo,
        order_id: order.id,
        handler: async function (response) {
          // 3. Verify Payment on Backend
          try {
            const verifyRes = await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              setLastTransactionId(response.razorpay_payment_id);
              setShowSuccessModal(true);
              fetchMyJobs(); 
            }
          } catch (err) {
            toast.error("Security verification failed. If money was debited, it will reflect within 2 hours.");
          } finally {
            setIsProcessingPayment(false);
            setActivePayingJob(null);
          }
        },
        modal: {
          ondismiss: function() {
            setIsProcessingPayment(false);
            setActivePayingJob(null);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Payment Error:", error);
      toast.error(error.response?.data?.msg || "Payment failed to initialize");
      setIsProcessingPayment(false);
      setActivePayingJob(null);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.status === 'open').length,
    applicants: jobs.reduce((acc, job) => acc + (job.applicants?.length || 0), 0)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
        <p className="flex-meta uppercase">Initializing Dashboard...</p>
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
            <Link to="/my-jobs" className="text-sm font-bold uppercase tracking-widest text-white transition-colors underline underline-offset-8 decoration-blue-500 decoration-2">dashboard</Link>
            <div className="h-6 w-px bg-slate-800" />
            <Link to="/post-job" className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all">
              <Plus size={14} /> New Listing
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-32">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 text-blue-500 flex-label rounded-lg flex items-center gap-2">
                <Settings size={12} /> Partner Portal
              </div>
            </div>
            <h1 className="flex-title-md">
              Manage <span className="text-slate-500 italic font-medium">Your Listings</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-sm">
             <button 
               onClick={() => setViewMode("grid")}
               className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-white'}`}
             >
               <LayoutGrid size={18} />
             </button>
             <button 
               onClick={() => setViewMode("list")}
               className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-white'}`}
             >
               <List size={18} />
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            { label: "Total Listings", val: stats.total, icon: Briefcase, color: "text-blue-500" },
            { label: "Active Roles", val: stats.active, icon: Eye, color: "text-green-500" },
            { label: "Total Applicants", val: stats.applicants, icon: Users, color: "text-purple-500" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex-card p-8 border-dashed relative overflow-hidden group"
            >
              <div className="relative z-10">
                <p className="flex-meta uppercase mb-2">{stat.label}</p>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-black text-white">{stat.val}</span>
                  <stat.icon size={20} className={stat.color} />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
                <stat.icon size={120} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="max-w-md mb-8 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search your listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-14 pr-5 text-white text-xs font-medium focus:outline-none focus:border-blue-600 transition-all backdrop-blur-sm"
          />
        </div>

        {/* Listings Display */}
        {filteredJobs.length === 0 ? (
          <div className="flex-card border-dashed p-20 text-center">
             <AlertCircle size={36} className="text-slate-800 mx-auto mb-4" />
             <p className="flex-label text-slate-500 italic mb-8">No matching listings found.</p>
             <Link to="/post-job" className="text-blue-500 flex-label uppercase hover:text-blue-400">Post your first job</Link>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job) => (
                <motion.div
                  key={job._id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className={`flex-card group hover:border-slate-700 transition-all ${viewMode === 'list' ? 'p-6 flex items-center justify-between gap-6' : 'p-10'}`}
                >
                  <div className={viewMode === 'list' ? 'flex items-center gap-6 overflow-hidden' : ''}>
                    {/* Status Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 ${
                      job.status === 'open' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${job.status === 'open' ? 'bg-green-500' : 'bg-slate-500'}`} />
                      {job.status}
                    </div>

                    <h3 className={`flex-title-sm truncate ${viewMode === 'list' ? 'mb-0' : 'mb-2'}`}>{job.title}</h3>
                    <p className="flex-meta uppercase mb-6">{job.category}</p>
                    
                    <div className={`flex flex-wrap items-center gap-6 ${viewMode === 'list' ? 'hidden sm:flex' : 'mb-10'}`}>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={14} />
                        <span className="text-[11px] font-bold tracking-tight">
                          {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-500">
                        <Users size={14} />
                        <span className="text-[11px] font-black tracking-tight">{job.applicants?.length || 0} Applicants</span>
                      </div>
                    </div>
                  </div>

                  <div className={`flex flex-col sm:flex-row items-center gap-3 ${viewMode === 'list' ? '' : 'mt-auto'}`}>
                    {job.paymentStatus === 'paid' ? (
                      <div className="flex-1 flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 text-green-500 py-3.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-default">
                        <CheckCircle size={14} /> Premium Listing
                      </div>
                    ) : (
                      <button 
                        onClick={() => handlePayment(job._id)}
                        disabled={isProcessingPayment}
                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                          activePayingJob === job._id 
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                            : 'bg-amber-600 text-white hover:bg-amber-500 shadow-amber-600/10'
                        }`}
                      >
                        {activePayingJob === job._id ? (
                          <>
                            <Loader2 size={14} className="animate-spin" /> Initializing...
                          </>
                        ) : (
                          <>
                            <Zap size={14} className="fill-white" /> Pay to Promote
                          </>
                        )}
                      </button>
                    )}
                    
                    <button 
                       onClick={() => {
                          setSelectedJobForDetail(job);
                          setIsDetailModalOpen(true);
                       }}
                       className="p-3.5 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl hover:text-white hover:border-slate-700 transition-all flex items-center justify-center"
                       title="View Listing Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => navigate(`/jobs/${job._id}/applicants`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/10"
                    >
                      View Applicants <ChevronRight size={14} />
                    </button>
                    <button className="p-3.5 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl hover:text-white hover:border-slate-700 transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {isDetailModalOpen && selectedJobForDetail && (
        <JobDetailModal
          job={selectedJobForDetail}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}

      {/* 🏆 Bank-Grade Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-500 p-8 flex justify-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle size={40} className="text-white" />
              </div>
            </div>
            
            <div className="p-8 text-center">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Payment Successful!</h3>
              <p className="text-slate-500 mb-6 font-medium">Your job listing has been professionally promoted to the top of the feed.</p>
              
              <div className="bg-slate-50 rounded-2xl p-4 mb-8 text-left border border-slate-100">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Transaction ID</span>
                  <span className="text-slate-900 text-xs font-mono font-bold">{lastTransactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Status</span>
                  <span className="text-emerald-600 text-xs font-black uppercase tracking-widest">Verified ✅</span>
                </div>
              </div>

              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyJobs;
