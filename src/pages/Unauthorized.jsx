import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export const Unauthorized = () => {
  const location = useLocation();
  const attemptedRole = location.state?.attemptedRole || 'current user';
  const requiredRoles = location.state?.requiredRoles || ['authorized'];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-lg shadow-rose-950/40">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-serif text-white">403 - Access Restricted</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your role (<span className="text-rose-400 font-bold uppercase">{attemptedRole}</span>) does not have sufficient clearance for this protected area.
          </p>
          <p className="text-[11px] text-slate-400">
            Required Clearance: {requiredRoles.join(', ').toUpperCase()}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link to="/dashboard" className="flex-1">
            <Button variant="primary" size="md" className="w-full" leftIcon={<Home className="w-4 h-4" />}>
              Dashboard
            </Button>
          </Link>
          <Link to="/" className="flex-1">
            <Button variant="secondary" size="md" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl">
        <h1 className="text-6xl font-extrabold font-serif bg-gradient-to-r from-teal-400 to-amber-300 bg-clip-text text-transparent">
          404
        </h1>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Page Not Located</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The property page or resource you are looking for has been transferred or does not exist.
          </p>
        </div>
        <Link to="/">
          <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Return to TRUSTY Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
