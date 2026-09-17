import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mockResetToken, setMockResetToken] = useState(null);
  const [error, setError] = useState('');

  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const res = await authService.forgotPassword(email);
      setSubmitted(true);
      if (res.data?.resetToken) {
        setMockResetToken(res.data.resetToken);
      }
      toast.success('Password reset instructions have been generated.');
    } catch (err) {
      setError(err.message || 'Unable to process reset request.');
      toast.error(err.message || 'Unable to process reset request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Your TRUSTY Password"
      subtitle="Enter your verified email address to receive password reset tokens."
    >
      <div className="space-y-6 text-slate-900 font-sans">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-[#0b132b] tracking-tight">Forgot Password</h2>
          <p className="text-xs text-slate-500">
            We will generate an encrypted reset token for your account.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#0b132b]">Reset Token Generated</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              If an account with <strong>{email}</strong> exists, instructions have been dispatched.
            </p>

            {mockResetToken && (
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-left space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-600">
                  Dev/Demo Reset Link:
                </span>
                <Link
                  to={`/reset-password?token=${mockResetToken}`}
                  className="block text-xs font-mono text-blue-600 hover:underline break-all"
                >
                  Click Here To Test Reset With Token ({mockResetToken.substring(0, 16)}...)
                </Link>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => {
                setSubmitted(false);
                setEmail('');
              }}
            >
              Send Another Request
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Account Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              error={error}
              required
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
              rightIcon={<ArrowUpRight className="w-4 h-4" />}
            >
              Send Password Reset Link
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
