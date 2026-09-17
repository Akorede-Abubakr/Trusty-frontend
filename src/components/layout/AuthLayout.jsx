import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Star, CheckCircle2, ArrowLeft } from 'lucide-react';

export const AuthLayout = ({
  children,
  title = 'Join the TRUSTY Marketplace',
  subtitle = 'The premier verified real estate network for buyers, tenants, owners, and licensed professionals.',
  quote = '“TRUSTY provided the verified escrow and instantaneous agent matching we needed to acquire our dream property in record time.”',
  quoteAuthor = 'Elena Rostova',
  quoteRole = 'Property Investor & Homeowner',
}) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between text-slate-900 font-sans">
      {/* Top Header Bar */}
      <div className="w-full bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight text-[#0b132b]">
            TRUSTY<span className="text-blue-600">.</span>
          </span>
        </Link>
        <Link
          to="/"
          className="text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Homepage</span>
        </Link>
      </div>

      {/* Center Content: Two Columns on Large Screens */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">
          {/* Left Column: Visual Brand Experience */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-8 bg-[#0b132b] text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-bold border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Certified Real Estate Platform</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
                {title}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Feature Checkpoints */}
            <div className="space-y-3 text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Verified ownership & certified MLS listings</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Multi-role permissions for Buyers, Renters, Owners & Agencies</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Bank-grade JWT security and privacy protocols</span>
              </div>
            </div>

            {/* Testimonial card */}
            <div className="p-5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
              <div className="flex gap-1 text-amber-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-200 italic mb-3">
                {quote}
              </p>
              <div>
                <p className="text-xs font-bold text-white">{quoteAuthor}</p>
                <p className="text-[11px] text-blue-300 font-semibold">{quoteRole}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Card Form */}
          <div className="col-span-1 lg:col-span-7 flex justify-center">
            <div className="w-full max-w-xl bg-white border border-slate-100 rounded-[32px] p-6 sm:p-10 shadow-xl">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Simple Footer */}
      <div className="w-full bg-white border-t border-slate-100 py-4 px-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} TRUSTY Real Estate. All rights reserved.
      </div>
    </div>
  );
};
