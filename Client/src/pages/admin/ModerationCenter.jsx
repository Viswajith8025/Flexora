import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Flag,
  Trash2,
  ShieldAlert,
  Search,
  User,
  ExternalLink,
  MessageSquare,
  Clock,
  CheckCircle,
  Eye
} from "lucide-react";
import toast from "react-hot-toast";

const ModerationCenter = () => {
  const [reportedJobs, setReportedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchReportedJobs();
  }, []);

  const fetchReportedJobs = async () => {
    try {
      const { data } = await api.getReportedJobs();
      setReportedJobs(data);
    } catch (err) {
      console.error("Failed to fetch reported jobs:", err);
      toast.error("Error loading mod queue");
    } finally {
      setLoading(false);
    }
  };

  const handleFlag = async (id) => {
    setProcessingId(id);
    try {
      await api.flagJob(id);
      toast.success("Listing Flagged Permanent");
      setReportedJobs(reportedJobs.map(j => (j._id || j.id) === id ? { ...j, isFlagged: true } : j));
    } catch (err) {
      toast.error("Flag action failed");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
       <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="w-10 h-10 border-2 border-slate-900 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-slate-600 text-[10px] uppercase font-black tracking-widest italic">Scanning Reports...</p>
       </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      
      {reportedJobs.length === 0 ? (
         <div className="flex-card min-h-[400px] border-dashed flex flex-col items-center justify-center p-20 text-center">
            <div className="w-20 h-20 bg-slate-950 rounded-[30px] flex items-center justify-center mb-8 border border-slate-900">
               <CheckCircle className="text-slate-800" size={32} />
            </div>
            <h3 className="text-white text-lg font-black uppercase tracking-tight mb-2">Platform Clean</h3>
            <p className="text-slate-500 text-xs italic lowercase">No active reports or community flags detected.</p>
         </div>
      ) : (
         <div className="space-y-6">
            <AnimatePresence mode="popLayout">
               {reportedJobs.map((job) => (
                  <motion.div
                    key={job._id || job.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-card p-10 bg-slate-900/40 border-slate-900 hover:border-amber-500/30 transition-all flex flex-col gap-10"
                  >
                     <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
                        <div className="flex-1 space-y-6">
                           <div className="flex items-center gap-3">
                              <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                 <AlertTriangle size={12} /> {job.reports?.length || 0} Reports Pending
                              </span>
                              {job.isFlagged && (
                                 <span className="px-3 py-1 rounded-lg bg-red-500 text-white text-[9px] font-black uppercase tracking-widest">
                                    Permanently Flagged
                                 </span>
                              )}
                           </div>
                           
                           <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none truncate max-w-xl">{job.title}</h3>
                           
                           <div className="flex flex-wrap items-center gap-6">
                              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                 <User size={14} className="text-blue-500" /> {job.provider?.name}
                              </div>
                              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                 <Clock size={14} className="text-slate-700" /> Created {new Date(job.createdAt).toLocaleDateString()}
                              </div>
                           </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                           <button 
                             onClick={() => handleFlag(job._id || job.id)}
                             disabled={processingId === (job._id || job.id) || job.isFlagged}
                             className={`flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${
                                job.isFlagged 
                                ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                                : "bg-amber-600 text-white hover:bg-amber-500 shadow-amber-500/10"
                             }`}
                           >
                              <Flag size={16} /> Flag Content
                           </button>
                           <button className="flex items-center justify-center gap-3 py-4 px-8 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-red-600/5 group">
                              <Trash2 size={16} className="group-hover:scale-110 transition-transform" /> Delete Permanently
                           </button>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-900/50 pt-10">
                        <div>
                           <p className="flex-meta uppercase text-white mb-6 flex items-center gap-2">
                              <Eye size={12} className="text-blue-500" /> Listing Preview
                           </p>
                           <div className="p-6 bg-slate-950 rounded-2xl border border-slate-900 border-dashed">
                              <p className="text-slate-500 text-xs leading-relaxed italic font-medium truncate mb-2">"{job.description}"</p>
                              <p className="text-slate-700 text-[10px] uppercase font-bold tracking-widest">Type: {job.jobType || "On-site"}</p>
                           </div>
                        </div>
                        <div>
                           <p className="flex-meta uppercase text-amber-500 mb-6 flex items-center gap-2 font-black">
                              <MessageSquare size={12} /> Community Reports
                           </p>
                           <div className="space-y-3 max-h-48 overflow-y-auto pr-3 custom-scrollbar">
                              {job.reports?.map((report, idx) => (
                                 <div key={idx} className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl relative group">
                                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-amber-500/5">
                                       <span className="text-amber-500/60 text-[8px] font-black uppercase tracking-widest">User ID: {report.user?.slice(-6) || "N/A"}</span>
                                       <span className="text-slate-800 text-[8px] font-bold uppercase tracking-widest">{new Date(report.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-slate-400 text-[10px] font-bold leading-relaxed lowercase italic">"{report.reason}"</p>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </AnimatePresence>
         </div>
      )}

      {reportedJobs.length > 0 && (
         <div className="p-10 bg-slate-900 shadow-2xl rounded-[40px] flex items-center justify-between gap-10 border border-slate-800">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-[24px] bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <ShieldAlert size={32} />
               </div>
               <div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1 leading-none">Global Safety Protocol</h4>
                  <p className="text-slate-500 text-xs font-medium italic lowercase">Ensure all moderation decisions comply with community guidelines.</p>
               </div>
            </div>
            <button className="flex-button-secondary !py-4 !px-8 text-white border-slate-700">Platform Guidelines <ExternalLink size={14} /></button>
         </div>
      )}
    </motion.div>
  );
};

export default ModerationCenter;
