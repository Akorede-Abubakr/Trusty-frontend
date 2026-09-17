import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Building,
  Key,
  Award,
  Users,
  Briefcase,
  Lock,
  RefreshCw,
  Clock,
  Home,
  FileText,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';

export const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [testResponse, setTestResponse] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const toast = useToast();

  const handleTestRbac = async (roleRequired) => {
    try {
      setIsTesting(true);
      setTestResponse(null);
      const res = await authService.testRoleAccess(roleRequired);
      setTestResponse({
        status: 'success',
        endpoint: roleRequired === 'admin' ? '/api/auth/admin-only' : '/api/auth/agent-agency-only',
        data: res,
      });
      toast.success(`Access Granted for required role: ${roleRequired.toUpperCase()}`);
    } catch (err) {
      setTestResponse({
        status: 'forbidden',
        endpoint: roleRequired === 'admin' ? '/api/auth/admin-only' : '/api/auth/agent-agency-only',
        data: err,
      });
      toast.warning(`Access Denied (403): User role [${user?.role}] is not authorized for ${roleRequired.toUpperCase()}`);
    } finally {
      setIsTesting(false);
    }
  };

  const getRoleWidgets = () => {
    switch (user?.role) {
      case 'agent':
      case 'agency':
        return [
          { label: 'Active Client Inquiries', value: '18 Leads', change: '+12% this week', icon: <Users className="w-5 h-5 text-blue-600" /> },
          { label: 'MLS Syndicated Listings', value: '7 Properties', change: 'All Verified', icon: <Building className="w-5 h-5 text-emerald-600" /> },
          { label: 'Pending Digital Escrows', value: '$1.85M', change: '2 Closings', icon: <Briefcase className="w-5 h-5 text-amber-600" /> },
        ];
      case 'owner':
        return [
          { label: 'Listed Portfolio', value: '3 Assets', change: 'Active', icon: <Award className="w-5 h-5 text-purple-600" /> },
          { label: 'Tenant Tour Requests', value: '9 Requests', change: '2 Pending', icon: <Clock className="w-5 h-5 text-blue-600" /> },
          { label: 'Estimated Equity Value', value: '$3.40M', change: '+8.4% YoY', icon: <TrendingUp className="w-5 h-5 text-emerald-600" /> },
        ];
      case 'renter':
        return [
          { label: 'Active Applications', value: '2 Properties', change: 'In Review', icon: <FileText className="w-5 h-5 text-indigo-600" /> },
          { label: 'Saved Rental Searches', value: '5 Locations', change: 'Miami & NYC', icon: <MapPin className="w-5 h-5 text-blue-600" /> },
          { label: 'Deposit Escrow Status', value: 'Verified Ready', change: '100% Protected', icon: <ShieldCheck className="w-5 h-5 text-emerald-600" /> },
        ];
      case 'buyer':
      default:
        return [
          { label: 'Saved Dream Homes', value: '14 Saved', change: '3 Price Drops', icon: <Home className="w-5 h-5 text-blue-600" /> },
          { label: 'Pre-Approval Certificate', value: 'Verified $1.2M', change: 'Active 60 Days', icon: <ShieldCheck className="w-5 h-5 text-emerald-600" /> },
          { label: 'Upcoming Tour Bookings', value: '2 Confirmed', change: 'This Saturday', icon: <Clock className="w-5 h-5 text-amber-600" /> },
        ];
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
        {/* 1. WELCOME BANNER */}
        <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user?.firstName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-md"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b132b] tracking-tight">
                    Welcome, {user?.firstName} {user?.lastName}
                  </h1>
                  <Badge role={user?.role} size="md" />
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <span>Account Email: <strong className="text-slate-800">{user?.email}</strong></span>
                  <span>•</span>
                  <span>Location: <strong className="text-slate-800">{user?.location?.city || 'United States'}</strong></span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshUser}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Refresh Profile
              </Button>
              <Link to="/profile">
                <Button variant="primary" size="sm">
                  Account Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 2. ROLE METRIC STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {getRoleWidgets().map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.label}</span>
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                  {stat.icon}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-extrabold text-[#0b132b] tracking-tight">{stat.value}</h3>
                <p className="text-xs text-emerald-600 font-semibold">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 3. USER SECURITY & PERMISSION STATUS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Card: Account Verification Details */}
          <div className="lg:col-span-6 p-7 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-[#0b132b]">Trust & Verification Matrix</h3>
                <p className="text-xs text-slate-500">Current authorization flags for this session</p>
              </div>
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600 font-medium">Identity Verification Status</span>
                <Badge variant={user?.verificationStatus === 'verified' ? 'verified' : 'pending'}>
                  {user?.verificationStatus}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600 font-medium">Account Operational Status</span>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 capitalize">
                  {user?.accountStatus}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600 font-medium">Assigned Role & Privileges</span>
                <span className="font-bold text-[#0b132b] uppercase">{user?.role}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600 font-medium">Member Since</span>
                <span className="text-slate-800 font-bold">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Right Card: Interactive RBAC Authorization Tester */}
          <div className="lg:col-span-6 p-7 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-[#0b132b]">Live RBAC Authorization Tester</h3>
                <p className="text-xs text-slate-500">Trigger backend role guard middleware</p>
              </div>
              <Lock className="w-6 h-6 text-amber-500" />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Test backend JWT authorization middleware in real-time. Test whether your current role (<strong className="text-[#0b132b] uppercase">{user?.role}</strong>) has access to role-gated backend endpoints.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="secondary"
                size="sm"
                isLoading={isTesting}
                onClick={() => handleTestRbac('agent')}
              >
                Test Agent/Agency Endpoint
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={isTesting}
                onClick={() => handleTestRbac('admin')}
              >
                Test Admin-Only Endpoint
              </Button>
            </div>

            {testResponse && (
              <div
                className={`p-4 rounded-2xl border text-xs space-y-1.5 animate-slide-up ${
                  testResponse.status === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>{testResponse.endpoint}</span>
                  <span>{testResponse.status === 'success' ? '200 OK (Allowed)' : '403 Forbidden (Blocked)'}</span>
                </div>
                <p className="text-[11px] opacity-90">
                  {testResponse.data?.message || 'Access validated by backend middleware.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
