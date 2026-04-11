import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api, { BACKEND_URL } from "../../services/api";
import { 
  Users, 
  ChevronLeft, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2,
  AlertCircle,
  ShieldCheck,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logooo.png";

import UserAvatar from "../../components/UserAvatar";

const Applicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(null); // stores userId being updated

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const fetchApplicants = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.getJobApplicants(id);
      setApplicants(data);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      toast.error("Failed to load applicants");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    // Optimistic UI update
    const previousApplicants = [...applicants];
    setApplicants(prev => prev.map(app => 
      app.user._id === userId ? { ...app, status: newStatus } : app
    ));

    setIsUpdating(userId);
    try {
      await api.updateApplicantStatus(id, userId, newStatus);
      toast.success(`Applicant ${newStatus === 'accepted' ? 'accepted' : 'rejected'}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
      // Rollback on error
      setApplicants(previousApplicants);
    } finally {
      setIsUpdating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
        <p className="flex-meta uppercase">Loading Candidates...</p>
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
            <Link to="/my-jobs" className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">back to listings</Link>
            <div className="h-6 w-px bg-slate-800" />
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center text-blue-500">
                  <ShieldCheck size={16} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">Management Suite</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 lg:px-8 pt-32">
        {/* Header Section */}
        <div className="mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft size={14} /> Back
          </button>
          
          <h1 className="flex-title-md mb-2">
            Review <span className="text-slate-500 italic font-medium">Applicants</span>
          </h1>
          <p className="flex-meta uppercase flex items-center gap-2 text-slate-500">
            <Users size={14} className="text-blue-500" /> {applicants.length} Total Candidates for this role
          </p>
        </div>

        {/* Applicants List */}
        {applicants.length === 0 ? (
          <div className="flex-card border-dashed p-20 text-center">
             <AlertCircle size={36} className="text-slate-800 mx-auto mb-4" />
             <p className="flex-label text-slate-500 italic">No applications received for this listing yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {applicants.map((applicant) => (
                <motion.div
                  key={applicant.user._id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-card p-8 group hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    {/* User Profile Info */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                         <UserAvatar 
                            user={applicant.user} 
                            className="w-16 h-16 rounded-2xl border-slate-800" 
                            textClassName="text-xl"
                         />
                         <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-500 shadow-xl">
                            <Star size={10} className="fill-amber-500" />
                         </div>
                      </div>
                      
                      <div>
                        <h3 className="flex-title-sm mb-1">{applicant.user.name}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-slate-500">
                           <div className="flex items-center gap-1.5 flex-meta lowercase">
                             <Mail size={12} className="text-blue-500" /> {applicant.user.email}
                           </div>
                           <div className="flex items-center gap-1.5 flex-meta lowercase">
                             <Phone size={12} className="text-blue-500" /> {applicant.user.phone || 'No phone'}
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Current Status Badge */}
                      <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${
                        applicant.status === 'accepted' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                        applicant.status === 'rejected' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                        'bg-slate-900 border-slate-800 text-slate-500'
                      }`}>
                        {applicant.status === 'applied' ? <Clock size={12} /> : 
                         applicant.status === 'accepted' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {applicant.status}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {isUpdating === applicant.user._id ? (
                           <div className="flex items-center gap-2 px-6 text-[10px] font-bold text-slate-700 uppercase">
                             <Loader2 size={14} className="animate-spin" /> syncing...
                           </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(applicant.user._id, 'accepted')}
                              disabled={applicant.status === 'accepted'}
                              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                applicant.status === 'accepted' 
                                  ? 'opacity-30 cursor-not-allowed bg-slate-900 text-slate-700' 
                                  : 'bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-600/10'
                              }`}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(applicant.user._id, 'rejected')}
                              disabled={applicant.status === 'rejected'}
                              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                applicant.status === 'rejected' 
                                  ? 'opacity-30 cursor-not-allowed bg-slate-900 text-slate-700' 
                                  : 'bg-slate-900 border border-slate-800 text-slate-500 hover:text-white hover:border-slate-700'
                              }`}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
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

export default Applicants;
