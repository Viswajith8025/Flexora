import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api, { BACKEND_URL } from '../services/api';
import { 
  User,
  Briefcase,
  Star,
  CheckCircle,
  DollarSign,
  MapPin,
  Calendar,
  Award,
  Users as UsersIcon,
  Zap,
  Shield,
  Mail,
  Phone,
  ChevronLeft,
  Building2,
  LogOut,
  ArrowRight,
  Inbox,
  Edit3,
  X,
  Plus,
  Trash2,
  Save,
  Camera,
  Upload
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logooo.png';
import toast from 'react-hot-toast';
import SlideButton from './SlideButton';
import { useRef } from 'react';

const KERALA_DISTRICTS = [
  "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", 
  "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", 
  "Thiruvananthapuram", "Thrissur", "Wayanad"
];

const SKILLS_LIST = [
  "Event Help", "Security", "Bouncer", "Web Developer", "Graphic Designer", 
  "Video Editor", "Photographer", "Caterer", "Driver", "Electrician", 
  "Plumber", "Anchor", "Marketing", "Sales"
];

const UserProfilePage = () => {
  const { user: currentUser, logout, refreshUser, isLoading: authLoading } = useAuth();
  const [isFetchingFresh, setIsFetchingFresh] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  // Edit State
  const [editForm, setEditForm] = useState({
    avatar: '',
    phone: '',
    age: '',
    district: '',
    skills: []
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Break the infinite refresh loop
  useEffect(() => {
    const fetchFreshData = async () => {
      try {
        await refreshUser();
      } catch (error) {
        console.error('Error refreshing user data:', error);
      } finally {
        setIsFetchingFresh(false);
      }
    };

    if (currentUser && isFetchingFresh) {
      fetchFreshData();
    } else if (!currentUser) {
      setIsFetchingFresh(false);
    }
  }, [currentUser, isFetchingFresh]);

  const handleOpenEdit = () => {
    setEditForm({
      avatar: currentUser.avatar || '',
      phone: currentUser.phone || '',
      age: currentUser.age || '',
      district: currentUser.district || '',
      skills: currentUser.skills || []
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateProfile = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('avatar', selectedFile);
      }
      formData.append('phone', editForm.phone || '');
      // Sanitize age: send 0 or integer to match backend safety
      const ageToSend = editForm.age ? parseInt(editForm.age) : 0;
      formData.append('age', isNaN(ageToSend) ? 0 : ageToSend);
      formData.append('district', editForm.district || '');
      formData.append('skills', JSON.stringify(editForm.skills || []));

      const response = await api.updateProfile(formData);
      
      if (response.data.user) {
        updateUser(response.data.user);
      } else {
        await refreshUser();
      }

      toast.success("Profile updated successfully");
      setIsEditModalOpen(false);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.msg || "Update failed";
      const details = err.response?.data?.details?.join(", ") || "";
      toast.error(`${errorMsg}${details ? ": " + details : ""}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSkill = (skill) => {
    const newSkills = editForm.skills.includes(skill)
      ? editForm.skills.filter(s => s !== skill)
      : [...editForm.skills, skill];
    setEditForm({ ...editForm, skills: newSkills });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (authLoading || isFetchingFresh) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) return null;

  const role = currentUser.role || 'job_seeker';
  const isProvider = ['job_provider', 'provider', 'partner', 'employer'].includes(role?.toLowerCase());

  const stats = isProvider ? [
    { label: "Jobs Posted", value: currentUser.completedJobs || 0, icon: <Briefcase size={18} /> },
    { label: "Avg Rating", value: currentUser.rating > 0 ? currentUser.rating.toFixed(1) : "—", icon: <Star size={18} /> }
  ] : [
    { label: "Jobs Done", value: currentUser.completedJobs > 0 ? currentUser.completedJobs : "—", icon: <CheckCircle size={18} /> },
    { label: "Skills Matched", value: currentUser.skills?.length || 0, icon: <Zap size={18} /> },
    { label: "Avg Rating", value: currentUser.rating > 0 ? currentUser.rating.toFixed(1) : "—", icon: <Star size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      
      {/* Header */}
      <nav className="fixed top-0 w-full z-[100] px-6 h-20 flex justify-between items-center bg-slate-950/80 border-b border-slate-900 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Flexora" className="h-16 w-auto" />
        </Link>
        <div className="flex items-center gap-6">
           <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors flex items-center gap-2">
              <ChevronLeft size={14} /> Back Home
           </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-24">
        
        {/* Profile Identity Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative mb-12">
          <div className="h-48 sm:h-64 rounded-[40px] bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-900 overflow-hidden relative shadow-2xl">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <div className="absolute top-0 right-0 w-full h-full bg-blue-600/5 blur-[120px]" />
          </div>

          <div className="px-8 sm:px-14 flex flex-col md:flex-row md:items-end justify-between -mt-16 sm:-mt-24 pb-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
              <div className="relative group cursor-pointer" onClick={handleOpenEdit}>
                 <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-[32px] bg-slate-900 border-4 sm:border-8 border-slate-950 shadow-2xl overflow-hidden flex items-center justify-center">
                    {currentUser.avatar ? (
                      <img 
                        src={currentUser.avatar.startsWith('/uploads') ? `${BACKEND_URL}${currentUser.avatar}` : currentUser.avatar} 
                        alt={currentUser.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-5xl font-black text-slate-700 uppercase">{currentUser.name?.charAt(0)}</span>
                    )}
                 </div>
                 <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px] flex items-center justify-center backdrop-blur-[2px]">
                    <Camera className="text-white" size={32} />
                 </div>
              </div>

              <div className="text-center md:text-left pt-6 pb-2">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                   <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase leading-none">{currentUser.name}</h1>
                    <div className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 text-blue-500 text-[8px] font-black uppercase tracking-widest rounded-lg">
                       {isProvider ? "Provider" : "Seeker"}
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                   <div className="flex items-center gap-2"><MapPin size={12} className="text-blue-500" /> {currentUser.district || "Location pending"}</div>
                   <div className="flex items-center gap-2 text-slate-700">|</div>
                   <div className="flex items-center gap-2 font-mono"><Mail size={12} /> {currentUser.email}</div>
                </div>
              </div>
            </div>

            <div className="mt-8 md:mt-24 flex gap-3">
               <button 
                 onClick={handleOpenEdit}
                 className="flex-1 md:flex-none px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
               >
                 <Edit3 size={14} /> Edit Profile
               </button>
               <button onClick={handleLogout} className="w-12 h-12 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl hover:text-red-500 transition-all flex items-center justify-center">
                 <LogOut size={18} />
               </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-8 lg:col-span-1">
            <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8">
               <h3 className="flex-meta text-white mb-8 border-b border-slate-800 pb-4">Activity Intel</h3>
               <div className="space-y-8">
                 {stats.map((stat, i) => (
                    <div key={i} className="flex items-center gap-5">
                      <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-500">{stat.icon}</div>
                      <div>
                        <div className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-0.5">{stat.label}</div>
                        <div className={`font-black text-xl tracking-tight leading-none ${stat.value === "—" ? 'text-slate-700 italic' : 'text-white'}`}>{stat.value}</div>
                      </div>
                    </div>
                 ))}
               </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8">
               <h3 className="flex-meta text-white mb-8 border-b border-slate-800 pb-4">Personal Details</h3>
               <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-slate-700"><Phone size={16} /></div>
                    <div className="flex flex-col">
                       <span className="text-slate-600 text-[8px] font-bold uppercase tracking-widest">Mobile</span>
                       <span className="text-slate-300 text-xs font-bold leading-none">{currentUser.phone || ""}</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-slate-700"><Calendar size={16} /></div>
                    <div className="flex flex-col">
                       <span className="text-slate-600 text-[8px] font-bold uppercase tracking-widest">Age</span>
                       <span className="text-slate-300 text-xs font-bold leading-none">{currentUser.age ? `${currentUser.age} Years` : "Not provided"}</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 sm:p-14 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px]" />
               <h3 className="flex-meta text-white mb-10 flex items-center gap-3"><Zap size={14} className="text-blue-500" /> Skill Inventory</h3>
               
               {currentUser.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                     {currentUser.skills.map((skill, idx) => (
                        <div key={idx} className="px-5 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-white">{skill}</span>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="p-10 border border-dashed border-slate-800 rounded-[32px] text-center">
                     <p className="text-slate-500 text-xs italic mb-8">No skills added to your inventory yet.</p>
                     <button onClick={handleOpenEdit} className="flex-button-secondary py-3 px-8 text-white mx-auto">Build Inventory</button>
                  </div>
               )}
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-[32px] p-10">
               <div className="flex flex-col md:flex-row gap-10 items-center justify-between">
                  <div className="space-y-4 max-w-md">
                     <h4 className="flex-meta text-white flex items-center gap-2"><Shield size={14} className="text-blue-500" /> Account Visibility</h4>
                     <p className="text-slate-500 text-xs leading-relaxed lowercase italic font-medium">
                        Your profile is active. Providers in <span className="text-white italic">{currentUser.district || "Kerala"}</span> will prioritize your applications based on your matched skills.
                     </p>
                  </div>
                  <div className="w-full md:w-auto text-center px-10 py-8 bg-slate-950 rounded-[32px] border border-slate-900 shadow-inner">
                     <p className="text-slate-600 text-[9px] font-bold uppercase tracking-widest mb-2">Profile Rank</p>
                     <div className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Standard</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="p-8 sm:p-12 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                 <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">Refine Identity</h2>
                    <p className="flex-meta text-slate-500 italic lowercase">Updated professional details for the system.</p>
                 </div>
                 <button onClick={() => setIsEditModalOpen(false)} className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-white transition-all"><X size={24} /></button>
              </div>

              <form onSubmit={handleUpdateProfile} className="flex-1 overflow-y-auto custom-scrollbar p-8 sm:p-12 space-y-12">
                 
                 {/* Read Only Block */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-slate-950/30 rounded-[32px] border border-slate-800/50">
                    <div>
                       <label className="flex-meta text-slate-700 mb-2 block">Full Name</label>
                       <input value={currentUser.name} disabled className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-slate-600 text-sm font-bold cursor-not-allowed" />
                    </div>
                    <div>
                       <label className="flex-meta text-slate-700 mb-2 block">Email Address</label>
                       <input value={currentUser.email} disabled className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-slate-600 text-sm font-bold cursor-not-allowed" />
                    </div>
                 </div>

                 {/* Editable Block */}
                 <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <label className="flex-meta text-white">Profile Photo</label>
                           <div className="flex items-center gap-6">
                              <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
                                {previewUrl ? (
                                  <img src={previewUrl} className="w-full h-full object-cover" />
                                ) : currentUser.avatar ? (
                                  <img src={currentUser.avatar.startsWith('/uploads') ? `${BACKEND_URL}${currentUser.avatar}` : currentUser.avatar} className="w-full h-full object-cover" />
                                ) : (
                                  <Camera className="text-slate-800" />
                                )}
                              </div>
                              <div className="flex-1">
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current.click()}
                                  className="px-6 py-3 bg-slate-950 border border-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:border-blue-500 transition-all flex items-center gap-3 w-full justify-center"
                                >
                                  <Upload size={14} /> {selectedFile ? 'Change Selection' : 'Upload New Photo'}
                                </button>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  onChange={handleFileChange}
                                  className="hidden"
                                  accept="image/*"
                                />
                                {selectedFile && <p className="text-[10px] text-blue-500 mt-2 italic">Selected: {selectedFile.name}</p>}
                              </div>
                           </div>
                        </div>
                       <div className="space-y-4">
                          <label className="flex-meta text-white">Mobile Number</label>
                          <input value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} placeholder="+91 0000 000000" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm font-medium focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-800" />
                       </div>
                       <div className="space-y-4">
                          <label className="flex-meta text-white">Age Factor</label>
                          <input type="number" value={editForm.age} onChange={(e) => setEditForm({...editForm, age: e.target.value})} placeholder="Years" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm font-medium focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-800" />
                       </div>
                       <div className="space-y-4">
                          <label className="flex-meta text-white">Kerala District</label>
                          <select value={editForm.district} onChange={(e) => setEditForm({...editForm, district: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm font-medium focus:border-blue-500 focus:outline-none appearance-none transition-all">
                             <option value="">Select Region</option>
                             {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <label className="flex-meta text-white flex items-center justify-between">
                          <span>Professional Skill Tree</span>
                          <span className="text-slate-700 lowercase italic">{editForm.skills.length} Selected</span>
                       </label>
                       <div className="p-8 bg-slate-950 border border-slate-800 rounded-[32px] flex flex-wrap gap-3">
                          {SKILLS_LIST.map(skill => (
                             <button
                               type="button"
                               key={skill}
                               onClick={() => toggleSkill(skill)}
                               className={`px-5 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                                 editForm.skills.includes(skill)
                                   ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/10"
                                   : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-white"
                               }`}
                             >
                               {skill}
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>
              </form>

              <div className="p-8 sm:p-12 border-t border-slate-800 bg-slate-900/50 flex gap-4">
                 <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Cancel Changes</button>
                 <button 
                   onClick={handleUpdateProfile}
                   disabled={isSaving}
                   className="flex-[2] bg-white text-slate-950 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                   {isSaving ? <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-950 rounded-full animate-spin" /> : <><Save size={14} /> Synchronize Profile</>}
                 </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfilePage;