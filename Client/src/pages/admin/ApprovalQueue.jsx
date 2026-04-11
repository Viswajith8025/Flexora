import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Briefcase,
  AlertCircle,
  Zap,
  User,
  ExternalLink,
  Eye,
  Trash2,
  X
} from "lucide-react";
import toast from "react-hot-toast";
import JobDetailModal from "../../components/JobDetailModal";

const ApprovalQueue = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedJobForDetail, setSelectedJobForDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [confirmReject, setConfirmReject] = useState(null);

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = async () => {
    try {
      const { data } = await api.getPendingJobs();
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch pending jobs:", err);
      toast.error("Error loading queue");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await api.approveJob(id);
      toast.success("Listing Authorized");
      setJobs(jobs.filter(j => (j._id || j.id) !== id));
    } catch (err) {
      toast.error("Approval failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      await api.deleteJob(id); // Using the secure admin rejection route
      toast.success("Listing Dismissed");
      setJobs(jobs.filter(j => (j._id || j.id) !== id));
      setConfirmReject(null);
      setIsDetailModalOpen(false); // Close modal if current job rejected from modal
    } catch (err) {
      toast.error("Rejection failed");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="w-10 h-10 border-2 border-slate-900 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-600 text-[10px] uppercase font-black tracking-widest italic">Synchronizing Queue...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      
      {jobs.length === 0 ? (
        <div className="flex-card min-h-[400px] border-dashed flex flex-col items-center justify-center p-20 text-center">
          <div className="w-20 h-20 bg-slate-950 rounded-[30px] flex items-center justify-center mb-8 border border-slate-900">
            <Zap className="text-slate-800" size={32} />
          </div>
          <h3 className="text-white text-lg font-black uppercase tracking-tight mb-2">Queue Cleared</h3>
          <p className="text-slate-500 text-xs italic lowercase">All pending job requests have been processed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {jobs.map((job) => (
              <motion.div
                key={job._id || job.id}
                layout
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -20 }}
                className="flex-card p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 group hover:border-blue-600/30 transition-all border-slate-900"
              >
                <div className="flex-1 flex gap-8">
                  <div className="w-20 h-20 rounded-[32px] bg-slate-950 border border-slate-900 flex items-center justify-center text-blue-500 shrink-0 shadow-lg shadow-blue-500/5 group-hover:bg-blue-600/5 transition-colors">
                    <Briefcase size={28} />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-600/10 border border-blue-600/20 text-blue-400 text-[8px] font-black uppercase tracking-widest">{job.category}</span>
                        <span className="text-slate-700 text-[10px] font-bold uppercase tracking-widest">ID: {job._id?.slice(-8) || "N/A"}</span>
                      </div>
                      <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tight group-hover:text-blue-500 transition-colors">{job.title}</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <User size={14} className="text-slate-700" /> 
                        <span className="text-white font-bold">{job.provider?.name}</span>
                        <span className="text-[10px] text-slate-800 tracking-tighter italic">({job.provider?.email})</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <MapPin size={14} className="text-slate-700" /> {job.location}
                      </div>
                    </div>
                    
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 max-w-2xl bg-slate-950/50 p-4 rounded-xl border border-slate-900 italic font-medium">
                      "{job.description}"
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full lg:w-48">
                  <button 
                    onClick={() => {
                      setSelectedJobForDetail(job);
                      setIsDetailModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-3 py-4 bg-slate-900 border border-slate-800 text-blue-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-blue-500/30 transition-all"
                  >
                    Review Full Specs <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => handleApprove(job._id || job.id)}
                    disabled={processingId === (job._id || job.id)}
                    className="flex items-center justify-center gap-3 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/10 group/btn"
                  >
                    {processingId === (job._id || job.id) ? (
                      <Clock className="animate-spin" size={16} />
                    ) : (
                      <>
                        Approve Listing <CheckCircle size={16} className="group-hover/btn:scale-110 transition-transform" />
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => setConfirmReject(job)}
                    disabled={processingId === (job._id || job.id)}
                    className="flex items-center justify-center gap-3 py-4 bg-slate-900 border border-slate-800 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all"
                  >
                    Reject <XCircle size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Admin Review Modal */}
      <JobDetailModal
        job={selectedJobForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        isAdminView={true}
        onApprove={handleApprove}
        onReject={setConfirmReject}
      />

      {/* Reject Confirmation Modal */}
      <AnimatePresence>
        {confirmReject && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmReject(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-slate-900 border border-slate-800 rounded-[32px] p-12 max-w-md w-full text-center shadow-2xl">
              <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8 text-red-500">
                <Trash2 size={28} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">Confirm Rejection</h3>
              <p className="text-slate-500 text-[10px] font-medium leading-relaxed mb-10 uppercase tracking-widest">
                Confirm rejection of <span className="text-white font-black">"{confirmReject.title}"</span>. This will remove the listing permanently.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setConfirmReject(null)} className="flex-1 py-3 text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">Cancel</button>
                <button onClick={() => handleReject(confirmReject._id || confirmReject.id)} className="flex-1 py-3 bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg shadow-red-500/20">Confirm Reject</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {jobs.length > 0 && (
        <div className="flex justify-center pt-8">
          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-center gap-4 max-w-lg">
            <AlertCircle size={20} className="text-amber-500 shrink-0" />
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest leading-relaxed">
              Careful: Approving a listing makes it visible to all verified seekers immediately. Check for policy violations.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ApprovalQueue;
