import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, MapPin, Briefcase, Filter, Trash2, Check } from "lucide-react";

const FilterSheet = ({ 
  isOpen, 
  onClose, 
  searchQuery, 
  setSearchQuery, 
  locationFilter, 
  setLocationFilter, 
  categoryFilter, 
  setCategoryFilter, 
  jobTypeFilter, 
  setJobTypeFilter,
  dateFilter,
  setDateFilter,
  categories,
  resultCount,
  onClear
}) => {
  const jobTypes = [
    { id: "on-site", name: "On-site" },
    { id: "remote", name: "Remote" },
    { id: "hybrid", name: "Hybrid" },
    { id: "freelance", name: "Freelance" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] lg:hidden pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm pointer-events-auto"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 max-h-[90vh] bg-slate-900 border-t border-slate-800 rounded-t-[40px] shadow-2xl flex flex-col pointer-events-auto"
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto my-6 shrink-0" />

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto px-8 pb-32 custom-scrollbar">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 text-blue-500 flex items-center justify-center">
                      <Filter size={18} />
                   </div>
                   <h2 className="flex-label text-white uppercase tracking-widest font-black">Refine Search</h2>
                </div>
                <button 
                  onClick={onClear}
                  className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors py-2"
                >
                  <Trash2 size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Clear All</span>
                </button>
              </div>

              {/* Search Section */}
              <div className="mb-10">
                <label className="flex-meta uppercase mb-4 block text-slate-500 font-black">Keywords</label>
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within:text-blue-500 transition-colors" size={16} />
                  <input
                    type="text"
                    placeholder="Role or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-14 pr-5 text-white text-xs font-medium focus:outline-none focus:border-blue-600 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Location Section */}
              <div className="mb-10">
                <label className="flex-meta uppercase mb-4 block text-slate-500 font-black">Location</label>
                <div className="relative group">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within:text-blue-500 transition-colors" size={16} />
                  <input
                    type="text"
                    placeholder="City or district..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-14 pr-5 text-white text-xs font-medium focus:outline-none focus:border-blue-600 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Date Filter Section */}
              <div className="mb-10">
                <label className="flex-meta uppercase mb-4 block text-slate-500 font-black">Job Date</label>
                <div className="relative group">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-800 group-focus-within:text-blue-500 transition-colors" size={16} />
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-14 pr-5 text-white text-xs font-medium focus:outline-none focus:border-blue-600 transition-all shadow-inner [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Category Pill Scroll */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4 pr-1">
                   <label className="flex-meta uppercase text-slate-500 font-black">Market Sector</label>
                   <span className="text-[10px] text-blue-500 font-black uppercase">{categoryFilter === 'all' ? 'Everywhere' : categoryFilter}</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 no-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`shrink-0 px-6 py-3 rounded-xl border flex items-center gap-3 transition-all ${
                        categoryFilter === cat.id
                          ? "bg-blue-600/10 border-blue-600/30 text-blue-500 shadow-xl shadow-blue-600/10"
                          : "bg-slate-950 border-slate-800 text-slate-600"
                      }`}
                    >
                      <span className="text-sm">{cat.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Type Section */}
              <div className="mb-4">
                <label className="flex-meta uppercase mb-4 block text-slate-500 font-black">Working Arrangement</label>
                <div className="grid grid-cols-2 gap-3">
                  {jobTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setJobTypeFilter(prev => prev === type.id ? "" : type.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        jobTypeFilter === type.id
                          ? "bg-blue-600/10 border-blue-600/30 text-blue-500"
                          : "bg-slate-950 border-slate-800 text-slate-600"
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">{type.name}</span>
                      {jobTypeFilter === type.id && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sheet Footer - Sticky */}
            <div className="p-8 pt-4 bg-slate-900 border-t border-slate-800/50 backdrop-blur-md sticky bottom-0">
               <button 
                 onClick={onClose}
                 className="w-full py-5 bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/40 active:scale-95 transition-all group"
               >
                 <span className="text-xs font-black uppercase tracking-widest italic group-hover:not-italic group-hover:tracking-[0.2em] transition-all">
                    Show {resultCount} Available Spots
                 </span>
                 <Check size={18} />
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FilterSheet;
