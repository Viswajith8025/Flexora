import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  Activity,
  Shield,
  ChevronRight,
  ArrowUpRight,
  LogOut,
  Clock,
  UserCheck,
  Building2,
  Zap
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logooo.png";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.allSettled([
        api.getAdminStats(),
        api.getPendingJobs(),
      ]);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (pendingRes.status === 'fulfilled') setPendingCount(pendingRes.value.data?.length || 0);
    } catch (err) {
      console.error("Admin data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { label: "Overview", icon: <LayoutDashboard size={16} />, path: "/flexora-admin" },
    { label: "Members", icon: <Users size={16} />, path: "/flexora-admin/users", badge: null },
    { label: "Approval Queue", icon: <CheckCircle size={16} />, path: "/flexora-admin/approvals", badge: pendingCount > 0 ? pendingCount : null },
    { label: "Moderation", icon: <AlertTriangle size={16} />, path: "/flexora-admin/moderation", badge: stats?.reportedJobs > 0 ? stats.reportedJobs : null },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const isOverview = location.pathname === "/flexora-admin";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside className="w-64 border-r border-slate-900 bg-[#090e1a] flex flex-col fixed inset-y-0 left-0 z-50">
        {/* Logo */}
        <div className="p-6 border-b border-slate-900/60">
          <Link to="/flexora-admin">
            <img src={logo} alt="Flexora" className="h-16 w-auto" />
          </Link>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Shield size={9} className="text-blue-400" />
            <span className="text-blue-400 text-[8px] font-black uppercase tracking-[0.15em]">System Control</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-500 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest">
                  {item.icon}
                  {item.label}
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className={`w-5 h-5 rounded-full text-[8px] font-black flex items-center justify-center ${isActive ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-400'}`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Admin Identity + Logout */}
        <div className="p-4 border-t border-slate-900/60">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/50 mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-sm">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-white uppercase tracking-wider truncate">{user?.name}</p>
              <p className="text-[8px] text-blue-400 font-bold uppercase tracking-widest">Root Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-slate-600 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest border border-transparent hover:border-red-500/20"
          >
            <LogOut size={12} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <main className="flex-1 ml-64 min-h-screen">
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-blue-600 rounded-full" />
            <h2 className="text-sm font-black text-white uppercase tracking-tight">
              {menuItems.find(m => m.path === location.pathname)?.label || "Control Center"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest">Platform Live</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          {isOverview ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-10">

              {/* Welcome */}
              <div>
                <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest mb-1">Control Panel</p>
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                  Platform <span className="text-blue-500">Intelligence</span>
                </h1>
              </div>

              {/* Alert if pending approvals */}
              {pendingCount > 0 && (
                <Link to="/flexora-admin/approvals" className="flex items-center justify-between p-5 bg-amber-500/5 border border-amber-500/20 rounded-[24px] hover:bg-amber-500/10 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-amber-400 text-xs font-black uppercase tracking-widest">{pendingCount} Job{pendingCount !== 1 ? 's' : ''} Awaiting Approval</p>
                      <p className="text-slate-600 text-[9px] mt-0.5">Providers are waiting — review and approve or reject</p>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-amber-500/50 group-hover:text-amber-400 transition-colors" />
                </Link>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: "Total Members", value: (stats?.totalUsers ?? 0) - 1, icon: <Users size={16} />, sub: "Seekers & Providers", color: "text-blue-400", glow: "bg-blue-600/5" },
                  { label: "Platform Jobs", value: stats?.totalJobs || 0, icon: <Briefcase size={16} />, sub: "All listings", color: "text-emerald-400", glow: "bg-emerald-600/5" },
                  { label: "Pending Review", value: pendingCount, icon: <Clock size={16} />, sub: "Awaiting approval", color: "text-amber-400", glow: "bg-amber-600/5" },
                  { label: "Flagged Content", value: stats?.reportedJobs || 0, icon: <AlertTriangle size={16} />, sub: "Need moderation", color: "text-red-400", glow: "bg-red-600/5" },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`relative p-7 rounded-[28px] bg-slate-900 border border-slate-800 overflow-hidden group hover:border-slate-700 transition-all`}
                  >
                    <div className={`absolute inset-0 ${s.glow} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className={`w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center ${s.color} mb-5`}>
                      {s.icon}
                    </div>
                    <div className="text-4xl font-black text-white tracking-tighter leading-none mb-2">
                      {s.value}
                    </div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">{s.label}</p>
                    <p className="text-[8px] text-slate-700 mt-0.5 italic">{s.sub}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quick Access Grid */}
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-5">Quick Access</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    {
                      label: "Member Registry",
                      desc: "View all job seekers and providers. Monitor activity, manage accounts.",
                      icon: <Users size={22} />,
                      path: "/flexora-admin/users",
                      color: "text-blue-400",
                      border: "hover:border-blue-600/30",
                    },
                    {
                      label: "Job Approvals",
                      desc: `${pendingCount} job${pendingCount !== 1 ? 's' : ''} posted by providers waiting for your sign-off.`,
                      icon: <CheckCircle size={22} />,
                      path: "/flexora-admin/approvals",
                      color: "text-emerald-400",
                      border: "hover:border-emerald-600/30",
                      badge: pendingCount,
                    },
                    {
                      label: "Moderation Center",
                      desc: "Review reported and flagged jobs. Remove violations from the platform.",
                      icon: <AlertTriangle size={22} />,
                      path: "/flexora-admin/moderation",
                      color: "text-amber-400",
                      border: "hover:border-amber-600/30",
                      badge: stats?.reportedJobs,
                    },
                  ].map((card, i) => (
                    <Link
                      key={i}
                      to={card.path}
                      className={`p-8 bg-slate-900 border border-slate-800 rounded-[32px] group transition-all ${card.border} hover:bg-slate-900/80`}
                    >
                      <div className={`${card.color} mb-6 flex items-center justify-between`}>
                        {card.icon}
                        {card.badge > 0 && (
                          <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-400 text-[8px] font-black">{card.badge} pending</span>
                        )}
                      </div>
                      <h3 className="text-white font-black text-sm uppercase tracking-tight mb-2">{card.label}</h3>
                      <p className="text-slate-600 text-[10px] leading-relaxed">{card.desc}</p>
                      <div className="flex items-center gap-2 mt-6 text-slate-700 group-hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest">
                        Open <ArrowUpRight size={12} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Platform Health */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-slate-900 border border-slate-800 rounded-[32px]">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                    <Zap size={12} className="text-blue-500" /> Platform Health
                  </p>
                  <div className="space-y-5">
                    {[
                      { label: "Open Jobs", value: stats?.openJobs || 0, total: stats?.totalJobs || 1, color: "bg-blue-500" },
                      { label: "Approved Jobs", value: (stats?.totalJobs || 0) - (pendingCount || 0), total: stats?.totalJobs || 1, color: "bg-emerald-500" },
                      { label: "Flagged Content", value: stats?.flaggedJobs || 0, total: stats?.totalJobs || 1, color: "bg-red-500" },
                    ].map((m, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-2">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{m.label}</span>
                          <span className="text-[9px] font-black text-white">{m.value}</span>
                        </div>
                        <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${m.color} rounded-full transition-all`}
                            style={{ width: `${Math.min((m.value / m.total) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8 bg-slate-900 border border-slate-800 rounded-[32px]">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                    <Activity size={12} className="text-emerald-500" /> Breakdown
                  </p>
                  <div className="space-y-5">
                    {[
                      { label: "Job Seekers", icon: <UserCheck size={14} />, color: "text-emerald-400 bg-emerald-500/10" },
                      { label: "Job Providers", icon: <Building2 size={14} />, color: "text-violet-400 bg-violet-500/10" },
                      { label: "Total Platform Jobs", icon: <Briefcase size={14} />, color: "text-blue-400 bg-blue-500/10" },
                    ].map((r, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-950/50 border border-slate-900">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${r.color}`}>
                          {r.icon}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </motion.div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
