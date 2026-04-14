import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logooo.png';
import toast from 'react-hot-toast';
import api from '../services/api';

const Contact = () => {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.submitInquiry(formData);
      toast.success("Message synchronization successfully!");
      setSent(true);
    } catch (err) {
      toast.error("Submission failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-16">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Flexora" className="h-20 w-auto" />
          </Link>
          <Link to="/" className="flex-button-secondary py-3 px-6 flex items-center gap-2">
            <ChevronLeft size={16} /> Back
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-card p-12 space-y-12"
          >
            <div>
              <h1 className="flex-title-sm uppercase mb-4">Get in Touch</h1>
              <p className="flex-meta italic">We're here to professionally crystallization your experience.</p>
            </div>

            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="flex-label text-white uppercase text-xs mb-1">Email Support</h4>
                  <p className="flex-meta lowercase font-bold text-slate-300">support@flexora.in</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="flex-label text-white uppercase text-xs mb-1">Call Us</h4>
                  <p className="flex-meta lowercase font-bold text-slate-300">+91 900 000 0000</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="flex-label text-white uppercase text-xs mb-1">Office</h4>
                  <p className="flex-meta lowercase font-bold text-slate-300 italic">Kochi, Kerala, India</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-card p-12"
          >
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                 <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                    <Send size={24} />
                 </div>
                 <h2 className="flex-label text-white uppercase">Message Sent</h2>
                 <p className="flex-meta italic">We'll identify and respond to your query within 24 hours.</p>
                 <button onClick={() => setSent(false)} className="text-blue-500 flex-label uppercase hover:text-blue-400">Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="flex-meta uppercase mb-3 block text-slate-500">Your Identity</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl py-4 px-6 text-white flex-label focus:outline-none focus:border-blue-600 transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="flex-meta uppercase mb-3 block text-slate-500">Contact Email</label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl py-4 px-6 text-white flex-label focus:outline-none focus:border-blue-600 transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="flex-meta uppercase mb-3 block text-slate-500">Message</label>
                  <textarea
                    rows={4}
                    placeholder="How can we crystallization your experience today?"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-900 rounded-2xl py-4 px-6 text-white flex-label focus:outline-none focus:border-blue-600 transition-all resize-none shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex-button-primary py-5 justify-center gap-3 disabled:opacity-50"
                >
                  <Send size={18} />
                  {isSubmitting ? "Finalizing..." : "Send Inquiry"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
