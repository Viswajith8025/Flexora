import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  User,
  Building2,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Sparkles
} from "lucide-react";
import api from "../services/api";

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "job_seeker",
  });

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
          role: formData.role === 'job_provider' ? 'provider' : 'user'
        });
        response = await api.login({
          email: formData.email,
          password: formData.password
        });
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        ...response.data.user,
        role: response.data.user.role === 'provider' ? 'job_provider' : 'job_seeker'
      }));

      window.location.reload(); // Refresh to update current user state across the app
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.response?.data?.msg || 'Authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors z-20"
        >
          <X size={20} />
        </button>

        <div className="p-10 sm:p-14">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-600/20 text-blue-500 mb-6 font-black italic shadow-lg">
               F
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase leading-none mb-3">
              {isLogin ? "Welcome back" : "Join Flexora"}
            </h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] italic">
              {isLogin ? "Sign in to your professional hub" : "Start your journey in seconds"}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-bold uppercase tracking-widest text-center italic"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <label className="text-white text-[10px] font-bold uppercase tracking-widest ml-1">Account Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: "job_seeker" })}
                        className={`flex items-center justify-center gap-3 py-4 rounded-xl border transition-all text-[10px] font-bold uppercase tracking-widest ${
                          formData.role === "job_seeker" ? "bg-blue-600/10 border-blue-600/30 text-blue-500 shadow-inner" : "bg-slate-950 border-slate-900 text-slate-700 hover:border-slate-800"
                        }`}
                      >
                        <User size={14} /> Seeker
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: "job_provider" })}
                        className={`flex items-center justify-center gap-3 py-4 rounded-xl border transition-all text-[10px] font-bold uppercase tracking-widest ${
                          formData.role === "job_provider" ? "bg-blue-600/10 border-blue-600/30 text-blue-500 shadow-inner" : "bg-slate-950 border-slate-900 text-slate-700 hover:border-slate-800"
                        }`}
                      >
                        <Building2 size={14} /> Partner
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-white text-[10px] font-bold uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within:text-blue-500 transition-colors" size={16} />
                      <input
                        type="text"
                        name="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl py-4 pl-14 pr-5 text-white text-xs font-medium focus:outline-none focus:border-blue-600 transition-all shadow-inner"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <label className="text-white text-[10px] font-bold uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl py-4 pl-14 pr-5 text-white text-xs font-medium focus:outline-none focus:border-blue-600 transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-white text-[10px] font-bold uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl py-4 pl-14 pr-14 text-white text-xs font-medium focus:outline-none focus:border-blue-600 transition-all shadow-inner"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-800 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 group disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign {isLogin ? "In" : "Up"}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <button
              onClick={switchMode}
              className="text-slate-600 hover:text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-all italic border-b border-transparent hover:border-white/20 pb-0.5"
            >
              {isLogin ? "No account yet? Create one" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[60px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/5 blur-[60px] pointer-events-none" />
      </motion.div>
    </div>
  );
};

export default AuthModal;
