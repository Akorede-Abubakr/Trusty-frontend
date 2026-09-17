import React, { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Users,
  Building,
  Award,
  Briefcase,
  AlertTriangle,
  Star,
  MessageSquare,
  Calendar,
  Bell,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout = ({ children, title = 'Administration', subtitle = '', actions = null }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navSections = [
    {
      heading: 'Executive Overview',
      items: [
        { label: 'Analytics Intelligence', path: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
      ],
    },
    {
      heading: 'Marketplace Directory',
      items: [
        { label: 'User Directory', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
        { label: 'Property Inventory', path: '/admin/properties', icon: <Building className="w-4 h-4" /> },
        { label: 'Licensed Agents', path: '/admin/agents', icon: <Award className="w-4 h-4" /> },
        { label: 'Brokerage Agencies', path: '/admin/agencies', icon: <Briefcase className="w-4 h-4" /> },
      ],
    },
    {
      heading: 'Compliance & Pipeline',
      items: [
        { label: 'Fraud & Reports', path: '/admin/reports', icon: <AlertTriangle className="w-4 h-4" /> },
        { label: 'Reviews Moderation', path: '/admin/reviews', icon: <Star className="w-4 h-4" /> },
        { label: 'Inquiries & Leads', path: '/admin/inquiries', icon: <MessageSquare className="w-4 h-4" /> },
        { label: 'Viewing Appointments', path: '/admin/viewings', icon: <Calendar className="w-4 h-4" /> },
      ],
    },
    {
      heading: 'Platform Control',
      items: [
        { label: 'Notifications & Alerts', path: '/admin/notifications', icon: <Bell className="w-4 h-4" /> },
        { label: 'System Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-teal-500 selection:text-white">
      {/* 1. LEFT FIXED/COLLAPSIBLE SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/95 border-r border-slate-800/80 backdrop-blur-2xl flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link to="/admin/analytics" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-500 to-amber-300 p-0.5 shadow-lg shadow-teal-950/50 flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <div>
              <span className="text-sm font-bold font-serif tracking-wider text-white block">
                TRUSTY <span className="text-teal-400">ADMIN</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                SaaS Governance
              </span>
            </div>
          </Link>

          {/* Close for mobile drawer */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Sections Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 no-scrollbar">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
                {sec.heading}
              </span>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== '/admin/analytics' && location.pathname.startsWith(item.path));
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-slate-950 font-bold shadow-md shadow-teal-950/40'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-teal-400 transition-colors'}`}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={user?.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
              alt="Admin"
              className="w-8 h-8 rounded-full object-cover border border-teal-500/40 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.firstName || 'System'} {user?.lastName || 'Admin'}</p>
              <span className="text-[10px] text-teal-400 font-mono uppercase font-semibold">Master Admin</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Log Out of Admin Portal"
            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50 border border-rose-500/20 transition-all flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* 2. RIGHT MAIN CONTENT VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/60 border border-slate-700 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb path */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <Link to="/admin/analytics" className="hover:text-teal-400 transition-colors">Admin</Link>
              <span>/</span>
              <span className="text-white font-semibold capitalize">
                {location.pathname.replace('/admin/', '').replace('/', ' ') || 'Overview'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            {/* Realtime API status */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-medium text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Backend API Live</span>
            </div>

            {/* Direct Switch to Consumer Portal */}
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-teal-400 px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all font-medium"
            >
              <span>Consumer App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Notification Bell Shortcut */}
            <Link
              to="/admin/notifications"
              title="System Alerts & Broadcasts"
              className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400 ring-2 ring-slate-900" />
            </Link>
          </div>
        </header>

        {/* Viewport Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">{title}</h1>
              {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2.5 flex-wrap">{actions}</div>}
          </div>

          {/* Children View Content */}
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};
