import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, Clock, Trash2, Filter, Search, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const InquiryManagement = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const { data } = await api.getInquiries();
            setInquiries(data);
        } catch (error) {
            toast.error("Failed to load inquiries");
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id) => {
        try {
            await api.resolveInquiry(id);
            toast.success("Inquiry marked as crystallizationed");
            fetchInquiries();
        } catch (error) {
            toast.error("Resolution failed");
        }
    };

    const filtered = inquiries.filter(i => 
        filter === 'all' ? true : i.status === filter
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="animate-spin text-blue-500 mb-4" />
            <p className="flex-meta uppercase">Orchestrating Support Data...</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                <div>
                    <h2 className="flex-title-sm uppercase">Support Inquiries</h2>
                    <p className="flex-meta italic mt-1">Manage user support requests and platform feedback.</p>
                </div>

                <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                    {['all', 'pending', 'resolved'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                filter === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-white'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="flex-card border-dashed p-20 text-center">
                    <AlertCircle size={36} className="text-slate-800 mx-auto mb-4" />
                    <p className="flex-label text-slate-500 italic">No inquiries found in this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((inquiry) => (
                            <motion.div
                                key={inquiry._id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="flex-card p-8 group hover:border-slate-700 transition-all border-dashed"
                            >
                                <div className="flex items-start justify-between gap-6">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500">
                                                <Mail size={16} />
                                            </div>
                                            <div>
                                                <h3 className="flex-label text-white uppercase">{inquiry.name}</h3>
                                                <p className="flex-meta lowercase text-blue-500">{inquiry.email}</p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ml-auto ${
                                                inquiry.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-green-500/10 border-green-500/20 text-green-500'
                                            }`}>
                                                {inquiry.status}
                                            </div>
                                        </div>
                                        
                                        <p className="bg-slate-950/50 p-6 rounded-2xl border border-slate-900 text-slate-400 text-sm leading-relaxed italic">
                                            "{inquiry.message}"
                                        </p>

                                        <div className="flex items-center gap-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                            <div className="flex items-center gap-2">
                                                <Clock size={12} /> {new Date(inquiry.createdAt).toLocaleString()}
                                            </div>
                                            {inquiry.status === 'resolved' && (
                                                <div className="flex items-center gap-2 text-green-600">
                                                    <CheckCircle size={12} /> Synchronization at {new Date(inquiry.resolvedAt).toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {inquiry.status === 'pending' && (
                                        <button
                                            onClick={() => handleResolve(inquiry._id)}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                                        >
                                            Resolve
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};

export default InquiryManagement;
