import React, { useState, useEffect } from 'react';
import api, { BACKEND_URL } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Briefcase, Inbox, Trash2, Search, 
  ChevronDown, UserCheck, Building2, AlertTriangle,
  Shield, X, CheckCircle, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

import UserAvatar from '../../components/UserAvatar';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('job_seeker'); // 'job_seeker' | 'job_provider'
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.getAllUsers();
      setUsers(data);
    } catch (err) {
      toast.error('Failed to load user registries');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.deleteUser(userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('Member successfully removed');
      setConfirmDelete(null);
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  const seekers = users.filter(u => u.role === 'job_seeker' || u.role === 'user');
  const providers = users.filter(u => u.role === 'job_provider' || u.role === 'provider');

  const getFilteredData = () => {
    const pool = activeTab === 'job_seeker' ? seekers : providers;
    return pool.filter(u => 
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    );
  };

  const filtered = getFilteredData();

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-slate-900 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">

      {/* Industrial-Standard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Seekers", value: seekers.length, icon: <UserCheck size={18} />, color: "text-emerald-500", role: 'job_seeker' },
          { label: "Partner Providers", value: providers.length, icon: <Building2 size={18} />, color: "text-violet-500", role: 'job_provider' },
          { label: "Platform Members", value: users.length, icon: <Users size={18} />, color: "text-blue-500", role: null },
        ].map((s, i) => (
          <button 
            key={i} 
            disabled={!s.role}
            onClick={() => s.role && setActiveTab(s.role)}
            className={`bg-slate-900 border rounded-[28px] p-8 flex items-center gap-6 text-left transition-all group ${
               s.role === activeTab ? 'border-slate-400 shadow-xl' : 'border-slate-800'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">{s.label}</p>
              <p className="text-3xl font-black text-white tracking-tighter leading-none">{s.value}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Section Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            {activeTab === 'job_seeker' ? <UserCheck className="text-emerald-500" /> : <Building2 className="text-violet-500" />}
            {activeTab === 'job_seeker' ? 'Seeker Registry' : 'Provider Registry'}
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
            Managing {activeTab === 'job_seeker' ? seekers.length : providers.length} verified platform partners
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${activeTab === 'job_seeker' ? 'candidates' : 'companies'}...`}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-700"
            />
          </div>
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl h-fit">
            <button 
              onClick={() => setActiveTab('job_seeker')}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'job_seeker' ? 'bg-emerald-600 text-white' : 'text-slate-500'
              }`}
            >
              Seekers
            </button>
            <button 
              onClick={() => setActiveTab('job_provider')}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'job_provider' ? 'bg-violet-600 text-white' : 'text-slate-500'
              }`}
            >
              Providers
            </button>
          </div>
        </div>
      </div>

      {/* Segmented Registry Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden">
        <div className={`grid ${activeTab === 'job_seeker' ? 'grid-cols-[1.5fr_1.5fr_100px_60px]' : 'grid-cols-[1.5fr_1.5fr_100px_60px]'} gap-4 px-8 py-5 border-b border-slate-800 text-[9px] text-slate-500 font-black uppercase tracking-widest bg-slate-950/20`}>
          <span>Member Information</span>
          <span>Contact Details</span>
          <span className="text-center">{activeTab === 'job_seeker' ? 'Applications' : 'Active Jobs'}</span>
          <span className="text-center">Action</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-slate-600 text-sm italic font-medium">No results found in {activeTab === 'job_seeker' ? 'Seeker' : 'Provider'} registry.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/40">
            {filtered.map((u, i) => (
              <motion.div
                key={u._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="grid grid-cols-[1.5fr_1.5fr_100px_60px] gap-4 px-8 py-6 hover:bg-slate-950/40 transition-all items-center"
              >
                <div className="flex items-center gap-4">
                  <UserAvatar 
                    user={u} 
                    className="w-10 h-10 rounded-xl" 
                    textClassName="text-[10px]" 
                  />
                  <div className="flex flex-col">
                    <span className="text-white text-xs font-black uppercase tracking-tight">{u.name}</span>
                    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-slate-400 text-[10px] font-bold truncate">{u.email}</span>
                  {u.role === 'job_provider' && (
                    <span className="text-[8px] text-violet-500/80 font-black uppercase tracking-widest">Verified Merchant</span>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center">
                  <span className="text-white font-black text-xs leading-none">
                    {activeTab === 'job_seeker' ? (u.applications || 0) : (u.postedJobs || 0)}
                  </span>
                  <span className="text-slate-600 text-[8px] font-bold uppercase tracking-widest mt-1">
                    {activeTab === 'job_seeker' ? 'Inbox' : 'Listings'}
                  </span>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setConfirmDelete(u)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-red-500/10 hover:text-red-500 transition-all group"
                  >
                    <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmDelete(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-slate-900 border border-slate-800 rounded-[40px] p-12 max-w-md w-full text-center shadow-22xl">
              <div className="w-20 h-20 rounded-[32px] bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8">
                <AlertTriangle className="text-red-500" size={32} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Confirm Removal</h3>
              <p className="text-slate-500 text-[11px] font-medium leading-relaxed mb-10 px-4">
                You are about to remove <span className="text-white font-black">"{confirmDelete.name}"</span> from the platform. This will permanently clear their identity and history.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-4 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Cancel</button>
                <button onClick={() => handleDelete(confirmDelete._id)} className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-xl shadow-red-600/20">Confirm Remove</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserManagement;
