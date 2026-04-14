import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logooo.png';

const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-16">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Flexora" className="h-20 w-auto" />
          </Link>
          <Link to="/" className="flex-button-secondary py-3 px-6 flex items-center gap-2">
            <ChevronLeft size={16} /> Back
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-card p-12 space-y-12"
        >
          <div className="border-b border-slate-800 pb-8">
            <h1 className="flex-title-sm uppercase">Terms of Service</h1>
            <p className="flex-meta italic mt-2">Simple rules for a professional marketplace.</p>
          </div>

          <div className="space-y-10">
            <section>
              <h4 className="flex-label text-white uppercase mb-4">1. The Platform</h4>
              <p className="flex-meta lowercase italic leading-relaxed">
                Flexora is a digital marketplace connecting Seekers and Employers in Kerala. We provide the tools, but the work agreement is directly between you and the other party.
              </p>
            </section>

            <section>
              <h4 className="flex-label text-white uppercase mb-4">2. User Conduct</h4>
              <p className="flex-meta lowercase italic leading-relaxed">
                Be professional. Real names, real photos, and real job details are mandatory. Any attempt to scam or misrepresent will result in a permanent ban.
              </p>
            </section>

            <section>
              <h4 className="flex-label text-white uppercase mb-4">3. Payments & Fees</h4>
              <p className="flex-meta lowercase italic leading-relaxed">
                Fees paid for job listings are non-refundable. Work payments between seekers and providers are managed independently, though we encourage fair and timely payouts.
              </p>
            </section>

            <section>
              <h4 className="flex-label text-white uppercase mb-4">4. Liability</h4>
              <p className="flex-meta lowercase italic leading-relaxed">
                Flexora is not responsible for any disputes, damages, or injuries occurring during the execution of work found via the platform.
              </p>
            </section>
          </div>

          <div className="pt-8 border-t border-slate-800 flex items-center gap-3">
             <Shield size={16} className="text-blue-500" />
             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Last Updated: April 2025</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
