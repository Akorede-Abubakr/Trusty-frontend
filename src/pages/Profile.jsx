import React, { useState } from 'react';
import { User, Lock, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';

export const Profile = () => {
  const { user, changePassword } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('password');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validatePasswordForm = () => {
    const errs = {};
    if (!passwordData.currentPassword) errs.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) {
      errs.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errs.newPassword = 'New password must be at least 6 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      errs.confirmNewPassword = 'New passwords do not match';
    }
    setPasswordErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setIsSubmittingPassword(true);
    const res = await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
    setIsSubmittingPassword(false);

    if (res.success) {
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-10 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[28px] bg-white border border-slate-100 shadow-md">
          <div className="flex items-center gap-4">
            <img
              src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={user?.firstName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-[#0b132b] tracking-tight">
                  {user?.firstName} {user?.lastName}
                </h2>
                <Badge role={user?.role} size="md" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('password')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'password'
                ? 'bg-[#0b132b] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Security & Password</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-[#0b132b] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile Information</span>
          </button>
        </div>

        {/* Security Tab */}
        {activeTab === 'password' && (
          <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl space-y-6 max-w-xl">
            <div>
              <h3 className="text-lg font-bold text-[#0b132b]">Change Account Password</h3>
              <p className="text-xs text-slate-500 mt-1">
                Ensure your account stays protected using a strong, distinct passphrase.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label="Current Password"
                name="currentPassword"
                type="password"
                placeholder="••••••••"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                error={passwordErrors.currentPassword}
                required
              />

              <Input
                label="New Password"
                name="newPassword"
                type="password"
                placeholder="••••••••"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                error={passwordErrors.newPassword}
                required
              />

              <Input
                label="Confirm New Password"
                name="confirmNewPassword"
                type="password"
                placeholder="••••••••"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                error={passwordErrors.confirmNewPassword}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmittingPassword}
                rightIcon={<ArrowUpRight className="w-4 h-4" />}
              >
                Update Password
              </Button>
            </form>
          </div>
        )}

        {/* Profile Details Tab */}
        {activeTab === 'profile' && (
          <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl space-y-6 max-w-xl">
            <div>
              <h3 className="text-lg font-bold text-[#0b132b]">Identity Details</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your registered user details and verified status on TRUSTY.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-500">First Name</span>
                <p className="text-slate-900 font-bold mt-1">{user?.firstName}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-500">Last Name</span>
                <p className="text-slate-900 font-bold mt-1">{user?.lastName}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 col-span-2">
                <span className="text-slate-500">Primary Email</span>
                <p className="text-slate-900 font-bold mt-1">{user?.email}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-500">Account Role</span>
                <p className="text-blue-600 font-bold capitalize mt-1">{user?.role}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-500">Verification Status</span>
                <p className="text-emerald-600 font-bold capitalize mt-1">{user?.verificationStatus}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
