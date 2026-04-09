import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  ArrowRight,
  Building2,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Zap,
  AlertCircle
} from "lucide-react";
import logo from "../../assets/logooo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";

const FlexoraAuth = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "job_seeker",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const intendedRoute = location.state?.from || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let response;
      if (isLogin) {
        response = await api.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        await api.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        response = await api.login({
          email: formData.email,
          password: formData.password
        });
      }

      const loggedInUser = response.data.user;
      
      // Safety: Ensure the role from the login response matches our registration intent
      // (Uses the local formData.role if the server role hasn't propagated yet in dev)
      const userToStore = { 
        ...loggedInUser, 
        role: !isLogin ? formData.role : loggedInUser.role 
      };

      login(response.data.token, userToStore);
      
      if (userToStore.role === 'admin') {
        navigate('/flexora-admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.response?.data?.msg || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "", role: "job_seeker" });
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-flex-sans relative overflow-hidden">
      
      {/* ── Visual Section (Left) ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r border-slate-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_#1e293b_0%,_transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,_#1e1b4b_0%,_transparent_50%)]" />
          <div className="absolute inset-0 backdrop-blur-[100px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full p-20 flex flex-col justify-between items-start">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img src={logo} alt="Flexora" className="h-14 w-auto drop-shadow-2xl" />
          </Link>

          <div>
             <motion.div
               key={isLogin}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
             >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                  <Sparkles size={12} className="text-blue-400" />
                  <span className="text-blue-400 text-[9px] font-bold uppercase tracking-[0.2em]">Next-Gen Work Marketplace</span>
                </div>
                <h2 className="text-5xl xl:text-7xl font-bold text-white mb-8 tracking-tighter leading-none">
                  {isLogin ? "Welcome back to the " : "Begin your journey with "}
                   <span className="text-slate-500 italic font-medium">elite.</span>
                </h2>
                <p className="text-slate-400 text-lg max-w-sm leading-relaxed mb-10">
                  Join Kerala's fastest-growing platform for verified talent and premium short-term opportunities.
                </p>
             </motion.div>

             <div className="grid grid-cols-2 gap-8 border-t border-slate-900 pt-10 mt-10">
                <div>
                   <div className="flex items-center gap-3 text-white font-bold text-sm mb-2">
                      <ShieldCheck size={18} className="text-blue-500" /> Secure
                   </div>
                   <p className="text-slate-500 text-xs">Industry-standard encryption and verified profile protocols.</p>
                </div>
                <div>
                   <div className="flex items-center gap-3 text-white font-bold text-sm mb-2">
                      <Zap size={18} className="text-blue-500" /> Instant
                   </div>
                   <p className="text-slate-500 text-xs">From profile creation to your first application in under 3 minutes.</p>
                </div>
             </div>
          </div>

          <div className="text-slate-600 text-[10px] uppercase tracking-widest font-bold">
            © 2026 Flexora Technologies. All rights reserved.
          </div>
        </div>

        {/* Floating cinematic orbs */}
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" 
        />
      </div>

      {/* ── Form Section (Right) ─────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-10 left-10 lg:hidden">
          <Link to="/">
            <img src={logo} alt="Flexora" className="h-10 w-auto" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors mb-8 group">
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back Home
            </Link>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-3">
              {isLogin ? "Sign In" : "Register"}
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              {isLogin ? "Access your dashboard" : "Create your premium account"}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-bold uppercase tracking-widest text-center italic"
            >
              {error}
            </motion.div>
          )}

          {/* Identity Persistence Warning */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-3"
          >
            <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-[9px] font-bold uppercase tracking-widest text-amber-500/80 leading-relaxed italic">
              Careful: Full Name and Email cannot be changed later. Password is also permanent in this version.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="space-y-3">
                    <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Account Role</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: "job_seeker" })}
                        className={`flex items-center justify-center gap-2 py-4 rounded-xl border transition-all text-[9px] font-black uppercase tracking-widest ${
                          formData.role === "job_seeker" ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700"
                        }`}
                      >
                        <User size={14} /> Seeker
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: "job_provider" })}
                        className={`flex items-center justify-center gap-2 py-4 rounded-xl border transition-all text-[9px] font-black uppercase tracking-widest ${
                          formData.role === "job_provider" ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700"
                        }`}
                      >
                        <Building2 size={14} /> Provider
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors" size={16} />
                      <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white text-xs font-medium focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-700"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white text-xs font-medium focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-4 pl-12 pr-12 text-white text-xs font-medium focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-button-primary w-full !py-4 shadow-xl shadow-blue-600/10 group"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Sign {isLogin ? "In" : "Up"}
                    <ArrowRight size={16} className="icon-nudge" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-slate-500 text-[10px] font-bold tracking-[0.15em]">
            {isLogin ? "Don't have an account?" : "Already a member?"}{" "}
            <button
              onClick={switchMode}
              className="text-white hover:text-blue-500 transition-colors underline underline-offset-4"
            >
              {isLogin ? "Join the network" : "Sign in to profile"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FlexoraAuth;