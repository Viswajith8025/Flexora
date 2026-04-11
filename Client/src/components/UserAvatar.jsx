import React from 'react';
import { BACKEND_URL } from '../services/api';

/**
 * UserAvatar: A premium identity component for Flexora.
 * Handles:
 * 1. Automatic backend URL prefixing for self-hosted media.
 * 2. High-fidelity initials fallback for missing profiles.
 * 3. Consistent styling across all user roles.
 */
const UserAvatar = ({ user, className = "w-10 h-10", textClassName = "text-xs" }) => {
  if (!user) return (
    <div className={`${className} rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center animate-pulse`}>
      <div className="w-1/2 h-1/2 bg-slate-800 rounded-full" />
    </div>
  );

  const getImageUrl = () => {
    if (!user.avatar) return null;
    if (user.avatar.startsWith('http')) return user.avatar;
    if (user.avatar.startsWith('/uploads')) return `${BACKEND_URL}${user.avatar}`;
    return user.avatar;
  };

  const imageUrl = getImageUrl();
  
  // Use the initials helper from context if available, or generate here
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const initials = user.initials || getInitials(user.name);

  return (
    <div className={`relative shrink-0 overflow-hidden flex items-center justify-center border transition-all ${className} ${
       user.role === 'job_provider' ? 'border-violet-500/20 bg-slate-900' : 
       user.role === 'admin' ? 'border-blue-500/20 bg-slate-950' : 
       'border-emerald-500/20 bg-slate-900'
    } rounded-xl group-hover:scale-105 shadow-xl`}>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={user.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      
      <div className={`absolute inset-0 flex items-center justify-center font-black uppercase tracking-tighter ${textClassName} ${
        user.role === 'job_provider' ? 'text-violet-500' : 
        user.role === 'admin' ? 'text-blue-500' : 
        'text-emerald-500'
      }`} style={{ display: imageUrl ? 'none' : 'flex' }}>
        {initials}
      </div>
    </div>
  );
};

export default UserAvatar;
