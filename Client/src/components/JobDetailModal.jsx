import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Clock, 
  Briefcase, 
  CheckCircle, 
  Mail, 
  Phone, 
  Info,
  Shield,
  ArrowRight,
  Heart,
  XCircle
} from 'lucide-react';
import { BACKEND_URL } from '../services/api';
import SlideButton from './SlideButton';

import UserAvatar from './UserAvatar';

const JobDetailModal = ({ 
  job, 
  isOpen, 
  onClose, 
  onApply, 
  isApplying, 
  isProviderView = false, 
  isAdminView = false,
  onApprove,
  onReject,
  onSave,
  isSaved
}) => {
  if (!job) return null;

  const formattedDate = (date) => {
    if (!date) return 'Flexible';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header / Banner Area */}
            <div className="relative h-48 sm:h-64 bg-slate-950 shrink-0 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent" />
               
               {/* Action Buttons */}
               <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
                  {onSave && !isProviderView && !isAdminView && (
                     <button 
                        onClick={() => onSave(job._id || job.id)}
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${isSaved ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'}`}
                     >
                        <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                     </button>
                  )}
                  <button 
                    onClick={onClose}
                    className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all"
                  >
                    <X size={20} />
                  </button>
               </div>

               <div className="absolute inset-x-8 bottom-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <div className="space-y-3">
                     <div className="flex gap-2">
                        <span className="px-3 py-1 bg-blue-600 border border-blue-500 rounded-lg text-white font-black text-[10px] uppercase tracking-widest">
                          {job.category || 'General'}
                        </span>
                        {job.jobType && (
                           <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                             {job.jobType}
                           </span>
                        )}
                     </div>
                     <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase leading-none">
                       {job.title}
                     </h2>
                  </div>
               </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 sm:p-12">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  
                  {/* Left Column: Description & Detailed Info */}
                  <div className="lg:col-span-2 space-y-12">
                     {/* Summary Stats Grid */}
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-12 border-b border-slate-800/60">
                        <div className="space-y-2">
                           <p className="flex-meta uppercase text-blue-500">Compensation</p>
                           <p className="text-xl font-black text-white">₹{job.compensation}<span className="text-slate-700 text-xs ml-1 uppercase">/{job.payType || 'hr'}</span></p>
                        </div>
                        <div className="space-y-2">
                           <p className="flex-meta uppercase text-emerald-500">Location</p>
                           <p className="text-sm font-bold text-white truncate">{job.location}</p>
                        </div>
                        <div className="space-y-2">
                           <p className="flex-meta uppercase text-amber-500">Start Date</p>
                           <p className="text-sm font-bold text-white truncate">{formattedDate(job.startDate || job.date)}</p>
                        </div>
                        <div className="space-y-2">
                           <p className="flex-meta uppercase text-purple-500">Estimated</p>
                           <p className="text-sm font-bold text-white truncate">{job.estimatedHours || '—'} Hours</p>
                        </div>
                     </div>

                     {/* Main Description */}
                     <section className="space-y-4">
                        <h3 className="flex-label text-white uppercase flex items-center gap-2">
                           <Briefcase size={14} className="text-blue-500" /> About the Position
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed italic whitespace-pre-line">
                           {job.description || "The provider hasn't listed a specific description for this role. Use the contact details below to inquire for more information."}
                        </p>
                     </section>

                     {/* Requirements Section */}
                     {job.requirements && (
                        <section className="space-y-4">
                           <h3 className="flex-label text-white uppercase flex items-center gap-2">
                              <Shield size={14} className="text-blue-500" /> Candidate Requirements
                           </h3>
                           <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800/60 border-dashed">
                              <p className="text-slate-400 text-sm leading-relaxed italic whitespace-pre-line">
                                 {job.requirements}
                              </p>
                           </div>
                        </section>
                     )}
                  </div>

                  {/* Right Column: Provider Info & CTAs */}
                  <div className="space-y-8">
                     {/* Provider Identity */}
                     <div className="flex-card flex-card-padding">
                        <h3 className="flex-label text-white mb-6 flex items-center gap-2">
                           <CheckCircle size={14} className="text-blue-500" /> Verified Employer
                        </h3>
                        <div className="flex items-center gap-4 mb-8">
                           <UserAvatar 
                             user={job.provider} 
                             className="w-12 h-12 rounded-xl" 
                             textClassName="text-xl" 
                           />
                           <div>
                              <p className="text-sm font-black text-white uppercase truncate">{job.provider?.name || 'Authorized Member'}</p>
                              <p className="flex-meta lowercase opacity-60">Flexora Partner</p>
                           </div>
                        </div>
                        
                        <div className="space-y-4 pt-6 border-t border-slate-800">
                           <div className="flex items-center gap-3">
                              <Mail size={14} className="text-slate-700" />
                              <span className="flex-meta lowercase truncate">
                                {isAdminView || isProviderView ? (job.contactEmail || job.provider?.email) : '••••••••••••@••••.com'}
                              </span>
                           </div>
                           <div className="flex items-center gap-3">
                              <Phone size={14} className="text-slate-700" />
                              <span className="flex-meta lowercase">
                                {isAdminView || isProviderView ? (job.contactPhone || "Not provided") : '+91 ••••• •••••'}
                              </span>
                           </div>
                        </div>

                        {(!isAdminView && !isProviderView) && (
                           <div className="mt-6 p-4 bg-orange-600/5 border border-orange-600/10 rounded-xl flex items-start gap-3">
                              <Info size={12} className="text-orange-500 shrink-0 mt-0.5" />
                              <p className="text-[10px] text-orange-400 font-medium italic leading-relaxed">
                                Contact details are revealed after your application is received and reviewed by the employer.
                              </p>
                           </div>
                        )}
                     </div>

                     {isAdminView && (
                        <div className="flex-card p-8 bg-slate-950/30 border-slate-800/40">
                          <h4 className="flex-label text-slate-500 mb-6 uppercase tracking-[0.2em] font-black">Audit Controls</h4>
                          <div className="space-y-3">
                             {onApprove && !job.isApproved && (
                                <button 
                                  onClick={() => {
                                    onApprove(job._id || job.id);
                                    onClose();
                                  }}
                                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
                                >
                                  Authorize Listing <CheckCircle size={14} />
                                </button>
                             )}
                             {onReject && (
                                <button 
                                  onClick={() => {
                                    onReject(job._id || job.id);
                                    onClose();
                                  }}
                                  className="w-full py-4 bg-slate-900 border border-slate-800 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all flex items-center justify-center gap-2"
                                >
                                  Reject Listing <XCircle size={14} />
                                </button>
                             )}
                          </div>
                          <div className="mt-6 space-y-2 pt-6 border-t border-slate-800/50">
                             <div className="flex justify-between flex-meta">
                                <span>Risk Level</span>
                                <span className="text-emerald-500 font-black">Low</span>
                             </div>
                             <div className="flex justify-between flex-meta">
                                <span>Provider UID</span>
                                <span className="text-white font-bold">{job.provider?._id?.slice(-8) || "N/A"}</span>
                             </div>
                          </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 p-8 border-t border-slate-800 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6">
               <p className="flex-meta uppercase">Listing Published {formattedDate(job.createdAt)}</p>
               <button 
                  onClick={onClose}
                  className="flex items-center gap-2 text-slate-500 hover:text-white flex-label transition-colors"
               >
                  Close Detail <ArrowRight size={14} />
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default JobDetailModal;
