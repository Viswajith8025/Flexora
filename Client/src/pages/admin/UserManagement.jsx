import React, { useState, useEffect } from 'react';
import api, { BACKEND_URL } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Briefcase, Inbox, Trash2, Search, 
  ChevronDown, UserCheck, Building2, AlertTriangle,
  Shield, X, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

import UserAvatar from '../../components/UserAvatar';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'job_seeker' | 'job_provider'
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.getAllUsers();
      setUsers(data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.deleteUser(userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('User removed from platform');
      setConfirmDelete(null);
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
                        u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = filter === 'all' || u.role === filter;
    return matchSearch && matchRole;
  });

  const seekers = users.filter(u => u.role === 'job_seeker' || u.role === 'user');
  const providers = users.filter(u => u.role === 'job_provider' || u.role === 'provider');

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Members", value: users.length, icon: <Users size={18} />, color: "text-blue-500" },
          { label: "Job Seekers", value: seekers.length, icon: <UserCheck size={18} />, color: "text-emerald-500" },
          { label: "Job Providers", value: providers.length, icon: <Building2 size={18} />, color: "text-violet-500" },
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
            placeholder="Search by name or email..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-700"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'job_seeker', 'job_provider'].map(r => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                filter === r ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'
              }`}
            >
              {r === 'all' ? 'All' : r === 'job_seeker' ? 'Seekers' : 'Providers'}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_120px_80px_80px_60px] gap-4 px-8 py-4 border-b border-slate-800 text-[9px] text-slate-500 font-black uppercase tracking-widest">
          <span>Member</span>
          <span>Email</span>
          <span>Role</span>
          <span className="text-center">Applications</span>
          <span className="text-center">Jobs Posted</span>
          <span className="text-center">Action</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-slate-600 text-sm italic">No members found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-900">
            {filtered.map((u, i) => {
              const isSeeker = u.role === 'job_seeker' || u.role === 'user';
              return (
                <motion.div
                  key={u._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-[1fr_1fr_120px_80px_80px_60px] gap-4 px-8 py-5 hover:bg-slate-950/50 transition-colors items-center"
                >
                  <div className="flex items-center gap-3">
                    <UserAvatar 
                      user={u} 
                      className="w-9 h-9 rounded-xl border-slate-700" 
                      textClassName="text-[10px]" 
                    />
                    <span className="text-white text-xs font-bold truncate">{u.name}</span>
                  </div>

                  <span className="text-slate-500 text-[10px] font-medium truncate">{u.email}</span>

                  <div>
                    <span className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border ${
                      isSeeker 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-violet-500/10 border-violet-500/20 text-violet-400'
                    }`}>
                      {isSeeker ? 'Job Seeker' : 'Provider'}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-slate-400">
                    <Inbox size={12} className="text-slate-600" />
                    <span className="text-xs font-bold">{u.applications || 0}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-slate-400">
                    <Briefcase size={12} className="text-slate-600" />
                    <span className="text-xs font-bold">{u.postedJobs || 0}</span>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => setConfirmDelete(u)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 hover:bg-red-500/10 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmDelete(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-slate-900 border border-slate-800 rounded-[32px] p-12 max-w-md w-full text-center shadow-2xl">
              <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8">
                <AlertTriangle className="text-red-500" size={28} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">Remove Member</h3>
              <p className="text-slate-500 text-xs mb-2">You are about to permanently remove:</p>
              <p className="text-white font-bold text-sm mb-2">{confirmDelete.name}</p>
              <p className="text-slate-600 text-xs mb-10 font-mono">{confirmDelete.email}</p>
              <div className="flex gap-4">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">Cancel</button>
                <button onClick={() => handleDelete(confirmDelete._id)} className="flex-1 py-3 bg-red-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-400 transition-all">Confirm Remove</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserManagement;
