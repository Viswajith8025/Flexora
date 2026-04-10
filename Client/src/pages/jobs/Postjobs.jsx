import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  FileText,
  CheckCircle,
  ChevronDown,
  Loader2,
  Users,
  Info,
  Calendar,
  Tag,
  Shield,
  LayoutDashboard,
  Bell,
  Sparkles
} from "lucide-react";
import logo from "../../assets/logooo.png";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import NotificationDropdown from "../../components/NotificationDropdown";
import { LogOut } from "lucide-react";

// ─── Constants ──────────────────────────────────────────────────────────────
const jobTypes = [
  { value: "general", label: "General Assistance" },
  { value: "events", label: "Event Logistics" },
  { value: "digital", label: "Digital Content" },
  { value: "delivery", label: "Delivery Lead" },
  { value: "retail", label: "Retail Support" },
  { value: "hospitality", label: "Hospitality Service" },
  { value: "logistics", label: "Logistics Operations" },
  { value: "security", label: "Security & Safety" },
  { value: "technical", label: "Technical Support" },
  { value: "creative", label: "Creative Design" }
];

// ─── Reusable Field Components ────────────────────────────────────────────────

const FieldLabel = ({ children, hint }) => (
  <div className="flex flex-col mb-4">
    <label className="flex-label text-white mb-1.5 flex items-center gap-2">
      {children}
    </label>
    {hint && (
      <span className="flex-meta lowercase italic flex items-center gap-1.5 opacity-60">
        <Info size={11} /> {hint}
      </span>
    )}
  </div>
);

const TextInput = ({ icon: Icon, placeholder, name, value, onChange, type = "text", required }) => (
  <div className="relative group">
    {Icon && (
      <Icon
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors"
        size={16}
      />
    )}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full bg-slate-950 border border-slate-900 rounded-xl py-4 text-white flex-label placeholder:text-slate-700 focus:outline-none focus:border-blue-600 transition-all shadow-inner ${Icon ? "pl-12 pr-4" : "px-4"}`}
    />
  </div>
);

const SelectInput = ({ name, value, onChange, children }) => (
  <div className="relative">
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-slate-950 border border-slate-900 rounded-xl py-4 pl-5 pr-12 text-white flex-label focus:outline-none focus:border-blue-600 transition-all appearance-none cursor-pointer shadow-inner"
    >
      {children}
    </select>
    <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none" />
  </div>
);

// ─── Step Progress Bar ────────────────────────────────────────────────────────

const StepBar = ({ currentStep, steps }) => (
  <div className="flex items-center gap-4 mb-16 px-4">
    {steps.map((s, i) => (
      <React.Fragment key={i}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm border transition-all ${
            i + 1 < currentStep
              ? "bg-green-500/10 border-green-500/20 text-green-500"
              : i + 1 === currentStep
              ? "bg-blue-600 border-blue-600 shadow-xl shadow-blue-600/20 text-white"
              : "bg-slate-950 border-slate-900 text-slate-700"
          }`}>
            {i + 1 < currentStep ? <CheckCircle size={18} /> : i + 1}
          </div>
          <span className={`flex-label hidden md:block ${i + 1 === currentStep ? "text-white" : "text-slate-600 opacity-60"}`}>
            {s}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div className={`flex-1 h-[2px] rounded-full transition-all duration-700 ${i + 1 < currentStep ? "bg-green-500/30" : "bg-slate-900"}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ─── Sidebar Preview ──────────────────────────────────────────────────────────

const JobPreview = ({ formData }) => {
  const hasAnyData = formData.jobTitle || formData.location || formData.payRate;
  
  return (
    <div className="flex-card p-8 sticky top-28 bg-slate-900/50 backdrop-blur-md space-y-8 border-dashed">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
         <p className="flex-meta uppercase">Live Preview</p>
         <div className="flex items-center gap-2 text-blue-500 flex-meta">
            <Sparkles size={12} /> Real-time
         </div>
      </div>
      
      {!hasAnyData ? (
        <div className="py-12 text-center">
          <Briefcase size={32} className="text-slate-800 mx-auto mb-6 opacity-40 shrink-0" />
          <p className="flex-meta italic lowercase">Your job preview will appear here as you fill in the details.</p>
        </div>
      ) : (
        <div className="space-y-6">
           <div className="space-y-2">
              <h4 className="text-xl font-bold text-white tracking-tight uppercase leading-tight line-clamp-2">
                {formData.jobTitle || "Untitled Position"}
              </h4>
              <div className="flex gap-2">
                 <span className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-lg text-blue-500 flex-label lowercase italic">
                   {jobTypes.find(t => t.value === formData.jobType)?.label || "Uncategorized"}
                 </span>
              </div>
           </div>

           <div className="grid grid-cols-1 gap-4 py-6 border-y border-slate-800/50 outline-slate-900 outline-dashed outline-1">
              <div className="flex items-center gap-3">
                 <MapPin size={14} className="text-blue-500 shrink-0" />
                 <span className="flex-label text-slate-300">{formData.location || "Location pending..."}</span>
              </div>
              <div className="flex items-center gap-3">
                 <DollarSign size={14} className="text-blue-500 shrink-0" />
                 <span className="flex-label text-white font-bold">
                   {formData.payRate ? `INR ${formData.payRate} / ${formData.payType}` : "Pay scale not set"}
                 </span>
              </div>
              <div className="flex items-center gap-3">
                 <Clock size={14} className="text-blue-500 shrink-0" />
                 <span className="flex-label text-slate-300">{formData.estimatedHours ? `${formData.estimatedHours} Hours total` : "Duration pending"}</span>
              </div>
           </div>

           <p className="flex-meta italic text-slate-500 line-clamp-4 leading-relaxed">
             {formData.description || "Position description is currently blank..."}
           </p>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const PostJob = () => {
  const [step, setStep] = useState(1);
  const { user: currentUser, logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    jobTitle: "",
    jobType: "",
    location: "",
    startDate: "",
    endDate: "",
    payRate: "",
    payType: "hourly",
    description: "",
    requirements: "",
    estimatedHours: "",
    contactEmail: "",
    contactPhone: "",
  });

  useEffect(() => {
    // Sync local form state if needed, but currentUser is handled by hook
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const canProceedStep1 = formData.jobTitle.trim().length >= 3 && formData.jobType;
  const canProceedStep2 = formData.location.trim() && formData.payRate;

  const handleSubmit = async () => {
    if (!currentUser) { navigate("/flexoraauth"); return; }
    setIsSubmitting(true);
    try {
      await api.createJob(formData);
      setStep(4);
    } catch (err) {
      const msg = err.response?.data?.msg || "Provision error. Try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      jobTitle: "", jobType: "", location: "", startDate: "", endDate: "",
      payRate: "", payType: "hourly", description: "", requirements: "",
      estimatedHours: "", contactEmail: "", contactPhone: "",
    });
    setStep(1);
    toast.success("Ready for your next listing");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Auth gate
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex-card p-12 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500 mx-auto mb-10">
            <Shield size={32} />
          </div>
          <h1 className="flex-title-sm mb-4 uppercase">Sign in to continue</h1>
          <p className="flex-label text-slate-500 mb-10 italic">
            You need to be logged in as an employer to post a job.
          </p>
          <Link
            to="/flexoraauth"
            className="w-full flex-button-primary py-5 justify-center"
          >
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* SaaS Header */}
      <nav className="fixed top-0 w-full z-[100] px-6 h-20 flex justify-between items-center bg-slate-950/80 border-b border-slate-900 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Flexora" className="h-16 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors">Home</Link>
            <span className="text-white font-bold text-[10px] uppercase tracking-widest border-b-2 border-blue-600 pb-1 cursor-default">Post Job</span>
            <Link to="/about" className="text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors">About</Link>
            <Link to="/jobs" className="text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors">Browse Jobs</Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <NotificationDropdown />
          
          <div className="flex items-center gap-3 pl-6 border-l border-slate-900">
             <div className="text-right hidden sm:block">
                <div className="flex-label text-white mb-1">{currentUser?.name || "Member"}</div>
                <div className="flex-meta capitalize text-blue-500 font-bold">
                   {currentUser?.role?.replace('_', ' ') || 'User'}
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
        {/* Page title */}
        <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
               <div className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 text-blue-500 flex-label rounded-lg flex items-center gap-2">
                  <Shield size={12} /> Employer
               </div>
            </div>
            <h1 className="flex-title-md">
               Post a <span className="text-slate-500 italic font-medium">New Job</span>
            </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Column */}
          <div className="lg:col-span-2">
            <StepBar
              currentStep={step}
              steps={["Job Details", "Location & Pay", "Review"]}
            />

            <AnimatePresence mode="wait">

              {/* ── STEP 1: Job Info ── */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-card flex-card-padding space-y-12"
                >
                  <div className="pb-8 border-b border-slate-800">
                    <h2 className="flex-label text-white uppercase text-lg">Job Details</h2>
                    <p className="flex-meta lowercase italic mt-2">Tell applicants what the job is and what you're looking for.</p>
                  </div>

                  <div className="space-y-10">
                    {/* Job Title */}
                    <div>
                      <FieldLabel hint="Be specific — good titles get more applicants (e.g. Event Staff Lead, not Helper)">
                        Job Title <span className="text-blue-500">*</span>
                      </FieldLabel>
                      <TextInput
                        icon={Briefcase}
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        placeholder="e.g. Event Coordinator, Delivery Rider"
                        required
                      />
                    </div>

                    {/* Job Category */}
                    <div>
                      <FieldLabel hint="Choosing the right category helps the right people find your job">
                        Job Category <span className="text-blue-500">*</span>
                      </FieldLabel>
                      <SelectInput name="jobType" value={formData.jobType} onChange={handleChange}>
                        <option value="" disabled>Select a category...</option>
                        {jobTypes.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </SelectInput>
                    </div>

                    {/* Description */}
                    <div>
                      <FieldLabel hint="Detail the operational tasks and required outcomes">
                        Description
                      </FieldLabel>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Define the scope of work and daily operational requirements..."
                        className="w-full bg-slate-950 border border-slate-900 rounded-2xl px-6 py-5 text-white flex-label placeholder:text-slate-700 focus:outline-none focus:border-blue-600 transition-all resize-none shadow-inner"
                      />
                    </div>

                    {/* Requirements */}
                    <div>
                      <FieldLabel hint="List mandatory skillsets or background requirements">
                        Requirements
                      </FieldLabel>
                      <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleChange}
                        rows={3}
                        placeholder="e.g. 2+ years in hospitality. English proficiency required."
                        className="w-full bg-slate-950 border border-slate-900 rounded-2xl px-6 py-5 text-white flex-label placeholder:text-slate-700 focus:outline-none focus:border-blue-600 transition-all resize-none shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-8 border-t border-slate-800">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!canProceedStep1}
                      className="flex-button-primary px-12 py-5"
                    >
                      Next: Location & Pay <ArrowRight size={16} className="ml-2 icon-nudge" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: Pay & Schedule ── */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-card flex-card-padding space-y-12"
                >
                  <div className="pb-8 border-b border-slate-800">
                    <h2 className="flex-label text-white uppercase text-lg">Location & Pay</h2>
                    <p className="flex-meta lowercase italic mt-2">Where is the job, and what does it pay?</p>
                  </div>

                  <div className="space-y-10">
                    {/* Location */}
                    <div>
                      <FieldLabel hint="Be specific — district or area name works well">Job Location <span className="text-blue-500">*</span></FieldLabel>
                      <TextInput
                        icon={MapPin}
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Ernakulam, Kochi"
                        required
                      />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <FieldLabel>Start Date</FieldLabel>
                        <TextInput
                          icon={Calendar}
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <FieldLabel>End Date</FieldLabel>
                        <TextInput
                          icon={Calendar}
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Pay */}
                    <div>
                      <FieldLabel hint="Listing a fair rate upfront gets you more applicants, faster">
                        Pay Rate <span className="text-blue-500">*</span>
                      </FieldLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative group">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 font-black text-sm">INR</span>
                          <input
                            type="number"
                            name="payRate"
                            value={formData.payRate}
                            onChange={handleChange}
                            placeholder="Amount"
                            min="0"
                            className="w-full bg-slate-950 border border-slate-900 rounded-xl py-4 pl-14 pr-5 text-white flex-label focus:outline-none focus:border-blue-600 transition-all shadow-inner"
                          />
                        </div>
                        <SelectInput name="payType" value={formData.payType} onChange={handleChange}>
                          <option value="hourly">per hour</option>
                          <option value="daily">per day</option>
                          <option value="fixed">fixed total</option>
                          <option value="weekly">per week</option>
                        </SelectInput>
                      </div>
                    </div>

                    {/* Hours */}
                    <div>
                      <FieldLabel hint="Helps applicants understand the time commitment">
                        Estimated Hours
                      </FieldLabel>
                      <TextInput
                        icon={Clock}
                        type="number"
                        name="estimatedHours"
                        value={formData.estimatedHours}
                        onChange={handleChange}
                        placeholder="e.g. 40 hours total"
                      />
                    </div>

                    {/* Contact */}
                    <div className="pt-10 border-t border-slate-800 border-dashed">
                      <div className="flex items-center gap-3 mb-8">
                         <Users size={16} className="text-blue-500" />
                         <span className="flex-meta uppercase">Contact Details (optional)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <FieldLabel>Your Email</FieldLabel>
                          <TextInput
                            type="email"
                            name="contactEmail"
                            value={formData.contactEmail}
                            onChange={handleChange}
                            placeholder="you@company.com"
                          />
                        </div>
                        <div>
                          <FieldLabel>Phone Number</FieldLabel>
                          <TextInput
                            type="tel"
                            name="contactPhone"
                            value={formData.contactPhone}
                            onChange={handleChange}
                            placeholder="+91 000 000 0000"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-8 border-t border-slate-800">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-button-secondary px-8"
                    >
                      <ArrowLeft size={16} className="mr-2" /> Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!canProceedStep2}
                      className="flex-button-primary px-12 py-5"
                    >
                      Review & Post <ArrowRight size={16} className="ml-2 icon-nudge" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Review & Confirm ── */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-card flex-card-padding space-y-12"
                >
                  <div className="pb-8 border-b border-slate-800">
                    <h2 className="flex-label text-white uppercase text-lg">Review Your Listing</h2>
                    <p className="flex-meta lowercase italic mt-2">Take one last look before your job goes live.</p>
                  </div>

                  {/* Summary card */}
                  <div className="flex-card bg-slate-950/50 overflow-hidden divide-y divide-slate-900 border-dashed">
                    <div className="p-8 bg-slate-950/30">
                      <p className="flex-meta uppercase mb-3">Job Title</p>
                      <h3 className="text-2xl font-black text-white tracking-tight uppercase leading-none">{formData.jobTitle || "—"}</h3>
                      {formData.jobType && (
                        <div className="mt-4 flex gap-2">
                           <span className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-lg text-blue-500 flex-label lowercase italic">
                             {jobTypes.find(t => t.value === formData.jobType)?.label || "—"}
                           </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-8 grid grid-cols-2 gap-10">
                      <div>
                        <p className="flex-meta uppercase mb-3">Location</p>
                        <p className="flex-label text-white flex items-center gap-2">
                          <MapPin size={14} className="text-blue-500" /> {formData.location || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="flex-meta uppercase mb-3">Pay</p>
                        <p className="flex-label text-white flex items-center gap-2">
                          <DollarSign size={14} className="text-blue-500" />
                          {formData.payRate ? `INR ${formData.payRate} ${formData.payType}` : "—"}
                        </p>
                      </div>
                    </div>

                    {formData.description && (
                      <div className="p-8">
                        <p className="flex-meta uppercase mb-4">Description</p>
                        <p className="text-slate-400 flex-label italic leading-relaxed">{formData.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-8 border-t border-slate-800">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-button-secondary px-8"
                    >
                      Edit Details
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-button-primary px-12 py-5"
                    >
                      {isSubmitting ? (
                        <><Loader2 size={18} className="animate-spin mr-3" /> Posting job...</>
                      ) : (
                        <><Sparkles size={18} className="mr-3" /> Post Job</>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 4: Success ── */}
              {step === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-card p-16 text-center shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
                  
                  <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-[32px] flex items-center justify-center mx-auto mb-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle size={44} className="text-green-500" />
                    </motion.div>
                  </div>
                  
                  <p className="flex-meta text-green-500 uppercase mb-3">Job Published!</p>
                  <h2 className="flex-title-sm mb-4 leading-tight">
                    {formData.jobTitle}
                  </h2>
                  <p className="flex-label text-slate-500 italic mb-12 max-w-sm mx-auto">
                    Your job is now live on the board. Applicants can find and apply to it right away.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => navigate("/")}
                      className="flex-button-primary px-10 py-5 justify-center"
                    >
                      Back Home
                    </button>
                    <button
                      onClick={resetForm}
                      className="flex-button-secondary px-10 py-5"
                    >
                      Post Another Job
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Live preview */}
            {step < 4 && <JobPreview formData={formData} />}

            {/* Platform Policy */}
            {step < 4 && (
              <div className="flex-card flex-card-padding bg-slate-950/50 space-y-8 border-dashed">
                <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
                   <Info size={14} className="text-blue-500" />
                   <p className="flex-meta uppercase">Quick Tips</p>
                </div>
                <ul className="space-y-8">
                  {[
                    { tip: "Clear job descriptions get more applicants", icon: Tag },
                    { tip: "Showing pay upfront builds trust", icon: DollarSign },
                    { tip: "A specific location helps local workers find you", icon: MapPin },
                    { tip: "Adding dates helps applicants plan their schedule", icon: Calendar },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
                         <item.icon size={13} className="text-slate-500" />
                      </div>
                      <span className="flex-meta lowercase italic opacity-80 mt-1">{item.tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Background Decorative Element */}
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
    </div>
  );
};

export default PostJob;
