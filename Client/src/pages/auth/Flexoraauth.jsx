import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Building2,
  ChevronLeft
} from "lucide-react";
import logo from "../../assets/logooo.png";
import { Link, useNavigate } from "react-router-dom";

const FlexoraAuth = () => {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

      // In the new flow, we redirect to home
      navigate('/');
      window.location.reload(); 
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.response?.data?.msg || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "job_seeker",
    });
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/5 blur-[150px] pointer-events-none" />
      
      {/* Header / Logo */}
      <div className="absolute top-10 left-10 z-20">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={logo} alt="Flexora" className="h-18 w-auto" />
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors mb-8 ml-2">
          <ChevronLeft size={14} /> Back Home
        </Link>

        <div className="flex-card p-10 md:p-16 shadow-2xl relative overflow-hidden">
          {/* Subtle decorative glow inside card */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[60px] pointer-events-none" />

          <div className="text-center mb-12">
             <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-600/20 text-blue-500 mb-6 font-black italic shadow-lg">
                F
             </div>
             <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase leading-none mb-3">
               {isLogin ? "Welcome back" : "Join Flexora"}
             </h2>
             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] italic">
               {isLogin ? "Sign in to your account" : "Start your journey in seconds"}
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
      </motion.div>
    </div>
  );
};

export default FlexoraAuth;