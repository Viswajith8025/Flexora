import React from "react";
import { motion } from "framer-motion";
import { MapPin, Star, ArrowRight, Briefcase, Loader2 } from "lucide-react";

const JobCard = ({ job, onClick, onApply, isApplying, customAction }) => {
  return (
    <motion.div
      layoutId={job.id || job._id}
      onClick={onClick}
      className="flex-card flex-between group cursor-pointer micro-lift h-full"
    >
      <div className="flex-card-padding space-y-6 w-full">
        {/* Header: Category & Urgency */}
        <div className="flex justify-between items-center">
          <div className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 text-blue-500 flex-label rounded-lg flex items-center gap-2">
            {job.category || 'General'}
          </div>
          {job.urgent && (
            <div className="flex items-center gap-1.5 text-red-500 flex-label lowercase italic">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              urgent priority
            </div>
          )}
        </div>

        {/* Title & Company */}
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-blue-500 transition-colors leading-tight">
            {job.title}
          </h3>
          <p className="flex-label text-slate-500 flex items-center gap-2">
            <Briefcase size={12} className="text-slate-700 shrink-0" />
            <span className="truncate">{job.company || 'Private Employer'}</span>
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-800/60">
          <div className="space-y-1.5">
            <span className="flex-meta uppercase">Location</span>
            <div className="flex items-center gap-1.5 text-white text-sm font-bold">
              <MapPin size={13} className="text-blue-500 shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
          </div>
          <div className="space-y-1.5 text-right">
            <span className="flex-meta uppercase">Compensation</span>
            <div className="flex items-center justify-end gap-1 text-white font-black text-lg leading-none">
              <span className="text-blue-500 text-xs font-bold uppercase mr-1">INR</span>
              {String(job.compensation || job.pay || '0').replace('₹', '')}
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between pt-2">
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <Star size={13} className="text-amber-500 fill-amber-500 shrink-0" />
            <span className="text-white font-bold text-sm leading-none">{job.rating || '4.8'}</span>
            <span className="flex-meta lowercase ml-1">(24 reviews)</span>
          </div>

          {/* CTA */}
          {customAction ? (
            <div className="w-full sm:w-auto" onClick={(e) => e.stopPropagation()}>{customAction}</div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (typeof onApply === 'function') {
                  onApply(job);
                } else {
                  console.warn("Flexora: No apply handler defined for this card.");
                }
              }}
              disabled={isApplying}
              className="flex-button-primary px-6"
            >
              {isApplying ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>Apply <ArrowRight size={13} className="ml-1 icon-nudge" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;