import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const Footer = () => {
  const { user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const toast = useToast();

  const homePath = isAuthenticated && user?.role === 'renter' ? '/dashboard' : '/';

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please provide a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success('Thank you for subscribing to TRUSTY Market Insights!');
    setEmail('');
  };

  return (
    <footer className="bg-[#fcfdfe] border-t border-slate-200/80 text-slate-600 mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <Link to={homePath} className="inline-block">
              <span className="text-2xl font-extrabold tracking-tight text-[#0b132b]">
                TRUSTY<span className="text-blue-600">.</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Step into a world of refined living with modern homes, elegant apartments, and serene cottages, all tailored for comfort and style.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 pt-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Certified MLS Verified Marketplace</span>
            </div>
          </div>

          {/* Nav Column 1 */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Property
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/#featured-properties" className="text-slate-600 hover:text-slate-900 transition-colors">Residential Homes</a></li>
              <li><a href="/#featured-properties" className="text-slate-600 hover:text-slate-900 transition-colors">Modern Villas</a></li>
              <li><a href="/#featured-properties" className="text-slate-600 hover:text-slate-900 transition-colors">Luxury Apartments</a></li>
              <li><a href="/#featured-properties" className="text-slate-600 hover:text-slate-900 transition-colors">Penthouses</a></li>
            </ul>
          </div>

          {/* Nav Column 2 */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/#about-trusty" className="text-slate-600 hover:text-slate-900 transition-colors">About Us</a></li>
              <li><a href="/#market-insights" className="text-slate-600 hover:text-slate-900 transition-colors">Market Blog</a></li>
              <li><a href="/#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors">Client Reviews</a></li>
              <li><a href="/#faq-section" className="text-slate-600 hover:text-slate-900 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Newsletter
            </h4>
            <p className="text-xs text-slate-500">
              Get weekly updates on exclusive luxury listings and neighborhood valuations.
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white text-slate-900 rounded-full border border-slate-200 px-4 py-2.5 text-xs focus:outline-none focus:border-slate-800 placeholder-slate-400 shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#0b132b] hover:bg-[#1c2541] text-white text-xs font-semibold transition-all shadow-sm flex-shrink-0 flex items-center gap-1"
              >
                <span>{subscribed ? 'Joined' : 'Subscribe'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} TRUSTY Real Estate. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-800 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-800 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-800 cursor-pointer">Equal Housing Opportunity</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
