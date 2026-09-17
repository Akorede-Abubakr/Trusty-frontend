import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowUpRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { authService } from '../services/authService';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetCompleted, setResetCompleted] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (tokenFromUrl) setToken(tokenFromUrl);
  }, [tokenFromUrl]);

  const validate = () => {
    const errs = {};
    if (!token.trim()) errs.token = 'Reset token is required';
    if (!newPassword) {
      errs.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      errs.newPassword = 'Password must be at least 6 characters';
    }
    if (newPassword !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await authService.resetPassword(token, newPassword);
      setResetCompleted(true);
      toast.success('Your password has been successfully reset.');
    } catch (err) {
      toast.error(err.message || 'Password reset token invalid or expired.');
      setErrors({ token: err.message || 'Token expired or invalid' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Enter your valid cryptographic reset token and set a new password."
    >
      <div className="space-y-6 text-slate-900 font-sans">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-[#0b132b] tracking-tight">Set New Password</h2>
          <p className="text-xs text-slate-500">
            Create a secure passphrase for your verified TRUSTY account.
          </p>
        </div>

        {resetCompleted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#0b132b]">Password Reset Successful</h4>
            <p className="text-xs text-slate-600">
              Your credentials have been updated. You may now sign in to your dashboard.
            </p>
            <Button
              variant="primary"
              size="md"
              className="w-full mt-2"
              onClick={() => navigate('/login')}
              rightIcon={<ArrowUpRight className="w-4 h-4" />}
            >
              Sign In to Your Account
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Reset Security Token"
              name="token"
              placeholder="Paste encrypted reset token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              error={errors.token}
              required
            />

            <Input
              label="New Password"
              name="newPassword"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={errors.newPassword}
              required
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              required
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
              rightIcon={<ArrowUpRight className="w-4 h-4" />}
            >
              Update Password & Sign In
            </Button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-100">
          <Link
            to="/login"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
