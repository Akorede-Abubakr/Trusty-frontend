import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  role,
  size = 'md',
  className = '',
}) => {
  // Determine variant automatically if role is specified
  let effectiveVariant = variant;
  if (role) {
    switch (role.toLowerCase()) {
      case 'agent':
        effectiveVariant = 'agent';
        break;
      case 'agency':
        effectiveVariant = 'agency';
        break;
      case 'owner':
        effectiveVariant = 'owner';
        break;
      case 'renter':
        effectiveVariant = 'renter';
        break;
      case 'buyer':
        effectiveVariant = 'buyer';
        break;
      case 'admin':
        effectiveVariant = 'admin';
        break;
      default:
        effectiveVariant = 'default';
    }
  }

  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    primary: 'bg-teal-950/60 text-teal-300 border-teal-500/40',
    gold: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    buyer: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40',
    renter: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40',
    owner: 'bg-purple-950/60 text-purple-300 border-purple-500/40',
    agent: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
    agency: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    admin: 'bg-rose-950/60 text-rose-300 border-rose-500/40',
    verified: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50',
    pending: 'bg-amber-950/70 text-amber-300 border-amber-500/50',
    unverified: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-medium tracking-wide uppercase',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide capitalize',
    lg: 'text-sm px-3.5 py-1.5 font-semibold capitalize',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${
        variants[effectiveVariant] || variants.default
      } ${sizes[size] || sizes.md} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{children || role}</span>
    </span>
  );
};
