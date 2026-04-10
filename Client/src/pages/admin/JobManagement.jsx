import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Search, Trash2, Calendar, MapPin, 
  DollarSign, CheckCircle, Clock, AlertTriangle,
  X, User, Info, ExternalLink, Mail, Phone
} from 'lucide-react';
import toast from 'react-hot-toast';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'live' | 'pending'
  const [selectedJob, setSelectedJob] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await api.getAllAdminJobs();
      setJobs(data);
    } catch (err) {
      toast.error('Failed to load job registry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await api.deleteJob(jobId);
      setJobs(prev => prev.filter(j => j._id !== jobId));
      toast.success('Listing permanently removed');
      setConfirmDelete(null);
    } catch (err) {
      toast.error('Failed to delete job');
    }
  };

  const filtered = jobs.filter(j => {
    const matchSearch = j.title?.toLowerCase().includes(search.toLowerCase()) ||
                        j.location?.toLowerCase().includes(search.toLowerCase()) ||
                        j.provider?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === 'all' || 
                        (filter === 'live' && j.isApproved) || 
                        (filter === 'pending' && !j.isApproved);
    return matchSearch && matchStatus;
  });

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-2 border-slate-900 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Platform Jobs", value: jobs.length, icon: <Briefcase size={18} />, color: "text-blue-500" },
          { label: "Live Listings", value: jobs.filter(j => j.isApproved).length, icon: <CheckCircle size={18} />, color: "text-emerald-500" },
          { label: "Awaiting Approval", value: jobs.filter(j => !j.isApproved).length, icon: <Clock size={18} />, color: "text-amber-500" },
        ].map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-[28px] p-8 flex items-center gap-6">
            <div className={`w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-1">{s.label}</p>
              <p className="text-3xl font-black text-white tracking-tighter leading-none">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, location, or provider..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-700 font-medium"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'live', 'pending'].map(r => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                filter === r ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Job Registry Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden">
        <div className="grid grid-cols-[2fr_1.5fr_1.5fr_120px_100px_80px] gap-4 px-8 py-5 border-b border-slate-800 text-[9px] text-slate-500 font-black uppercase tracking-widest bg-slate-950/20">
          <span>Job Information</span>
          <span>Location</span>
          <span>Posted By</span>
          <span className="text-center">Payment</span>
          <span className="text-center">Status</span>
          <span className="text-center">Action</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-slate-600 text-sm italic font-medium">No listings found in registry.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/40">
            {filtered.map((j, i) => (
              <motion.div
                key={j._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => setSelectedJob(j)}
                className="grid grid-cols-[2fr_1.5fr_1.5fr_120px_100px_80px] gap-4 px-8 py-5 hover:bg-slate-950/40 transition-all items-center cursor-pointer group border-l-4 border-l-transparent hover:border-l-blue-600"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-white text-xs font-black uppercase tracking-tight truncate group-hover:text-blue-500 transition-colors">{j.title}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">{j.category}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-800" />
                    <span className="text-[9px] text-slate-700 font-medium italic">ID: {j._id?.slice(-6)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin size={12} className="text-slate-700" />
                  <span className="text-[10px] font-bold truncate">{j.location}</span>
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-white font-bold text-[10px] truncate">{j.provider?.name || 'Unknown'}</span>
                  <span className="text-[8px] text-slate-700 italic truncate">{j.provider?.email}</span>
                </div>

                <div className="text-center">
                  <span className="text-emerald-400 font-black text-xs">₹{j.compensation}</span>
                </div>

                <div className="flex justify-center">
                  <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${
                    j.isApproved 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  }`}>
                    {j.isApproved ? <CheckCircle size={10} /> : <Clock size={10} />}
                    {j.isApproved ? 'Live' : 'Pending'}
                  </span>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDelete(j);
                    }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 hover:bg-red-500/10 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Investigative Detail Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedJob(null)} className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} className="relative bg-slate-900 border border-slate-800 rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
              
              {/* Header */}
              <div className="p-10 pb-6 border-b border-slate-800/50 bg-slate-950/20">
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border ${selectedJob.isApproved ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                    {selectedJob.isApproved ? 'Live Marketplace Listing' : 'Awaiting Administrative Audit'}
                  </div>
                  <button onClick={() => setSelectedJob(null)} className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                    <X size={20} />
                  </button>
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">{selectedJob.title}</h2>
                <div className="flex items-center gap-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-blue-500">{selectedJob.category}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-800" />
                  <span>Posted {new Date(selectedJob.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                
                {/* Provider Panel */}
                <div className="bg-slate-950/60 rounded-3xl p-6 border border-slate-800/50">
                   <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest mb-4">Job Provider Details</p>
                   <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-lg">
                        {selectedJob.provider?.name?.[0] || 'P'}
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-white font-bold text-sm uppercase tracking-tight">{selectedJob.provider?.name}</h4>
                         <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                               <Mail size={10} className="text-blue-500" /> {selectedJob.provider?.email}
                            </div>
                            {selectedJob.contactPhone && (
                               <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                                  <Phone size={10} className="text-emerald-500" /> {selectedJob.contactPhone}
                               </div>
                            )}
                         </div>
                      </div>
                   </div>
                </div>

                {/* Core Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-950/30 border border-slate-800/30 rounded-3xl">
                    <p className="text-slate-600 text-[8px] font-black uppercase tracking-widest mb-2">Location & Reach</p>
                    <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-tight">
                      <MapPin size={14} className="text-blue-500" /> {selectedJob.location}
                    </div>
                  </div>
                  <div className="p-6 bg-slate-950/30 border border-slate-800/30 rounded-3xl">
                    <p className="text-slate-600 text-[8px] font-black uppercase tracking-widest mb-2">Payment Terms</p>
                    <div className="flex items-center gap-2 text-emerald-400 font-black text-lg tracking-tight">
                      <DollarSign size={16} /> {selectedJob.compensation} <span className="text-[9px] text-slate-700 uppercase ml-1">Platform Currency</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Info size={12} className="text-blue-500" /> Detailed Description
                  </p>
                  <div className="bg-slate-950/40 p-8 rounded-[32px] border border-slate-800/40 italic text-slate-400 text-xs leading-relaxed font-medium">
                    "{selectedJob.description}"
                  </div>
                </div>

                {/* Requirements (if any) */}
                {selectedJob.requirements && (
                  <div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Core Requirements</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.requirements.split(',').map((req, i) => (
                        <span key={i} className="px-3 py-1.5 bg-slate-800 rounded-lg text-[9px] font-bold text-slate-300 border border-slate-700/50 mb-1">
                          {req.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Footer Actions */}
              {!selectedJob.isApproved && (
                <div className="p-10 pt-0">
                  <button 
                    onClick={async () => {
                      try {
                        await api.approveJob(selectedJob._id);
                        toast.success('Listing Authorized');
                        fetchJobs();
                        setSelectedJob(null);
                      } catch (err) {
                        toast.error('Approval failed');
                      }
                    }}
                    className="w-full py-5 bg-blue-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all flex items-center justify-center gap-3"
                  >
                    Authorize Listing <ExternalLink size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmDelete(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-slate-900 border border-slate-800 rounded-[32px] p-12 max-w-md w-full text-center shadow-2xl">
              <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8">
                <AlertTriangle className="text-red-500" size={28} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">Remove Listing</h3>
              <p className="text-slate-500 text-[10px] font-medium leading-relaxed mb-10 uppercase tracking-widest">
                You are about to permanently remove <span className="text-white font-black">"{confirmDelete.title}"</span> from the platform. This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">Cancel</button>
                <button onClick={() => handleDelete(confirmDelete._id)} className="flex-1 py-3 bg-red-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-400 transition-all shadow-lg shadow-red-500/20">Confirm Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default JobManagement;
