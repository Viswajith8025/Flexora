import React, { useState, useEffect } from 'react';
import { Bell, X, Clock, CheckCircle, Package, Settings, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch (error) {
      toast.error('Failed to update notifications');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'application_submitted': return <Package size={14} className="text-blue-500" />;
      case 'status_update': return <CheckCircle size={14} className="text-green-500" />;
      default: return <Info size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white transition-colors group"
      >
        <Bell size={20} className={unreadCount > 0 ? "animate-pulse" : ""} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 rounded-full text-[10px] flex items-center justify-center font-black text-white shadow-lg shadow-blue-600/20">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-[110]" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 mt-4 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-[120] overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm tracking-tight uppercase">Notifications</h3>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">
                    {unreadCount} New Alerts
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {isLoading && notifications.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-6 h-6 border-2 border-slate-800 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Checking alerts...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-900">
                      <Bell size={20} className="text-slate-800" />
                    </div>
                    <p className="text-sm text-slate-500 italic font-medium">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/50">
                    {notifications.map((n, i) => (
                      <div 
                        key={n._id || i}
                        className={`p-5 hover:bg-slate-800/40 transition-colors relative group ${!n.isRead ? 'bg-blue-600/5' : ''}`}
                        onClick={() => !n.isRead && markAsRead(n._id)}
                      >
                        <div className="flex gap-4">
                          <div className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${!n.isRead ? 'bg-blue-600/10 border-blue-600/20' : 'bg-slate-950 border-slate-800'}`}>
                            {getTypeIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className={`text-xs font-bold tracking-tight truncate ${!n.isRead ? 'text-white' : 'text-slate-400'}`}>
                                {n.title}
                              </h4>
                              {!n.isRead && (
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed mb-3 line-clamp-2">
                              {n.message}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                              <Clock size={10} />
                              {new Date(n.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-950/50 border-t border-slate-800 text-center">
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                  View full activity log
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
