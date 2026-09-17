import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Building,
  Key,
  Award,
  Users,
  Briefcase,
  Mail,
  Lock,
  Phone,
  User as UserIcon,
  MapPin,
  CheckCircle2,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'buyer';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: initialRole,
    phone: '',
    city: '',
    state: '',
    agencyName: '',
    bio: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const r = searchParams.get('role');
    if (r && ['buyer', 'renter', 'owner', 'agent', 'agency'].includes(r)) {
      setFormData((prev) => ({ ...prev, role: r }));
    }
  }, [searchParams]);

  const roles = [
    {
      id: 'buyer',
      title: 'Buyer',
      subtitle: 'Searching for homes & investments',
      icon: <Building className="w-4 h-4" />,
    },
    {
      id: 'renter',
      title: 'Renter',
      subtitle: 'Seeking apartments & leases',
      icon: <Key className="w-4 h-4" />,
    },
    {
      id: 'owner',
      title: 'Property Owner',
      subtitle: 'Listing my owned properties',
      icon: <Award className="w-4 h-4" />,
    },
    {
      id: 'agent',
      title: 'Agent',
      subtitle: 'Licensed real estate professional',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'agency',
      title: 'Brokerage Agency',
      subtitle: 'Commercial firm & multi-agent roster',
      icon: <Briefcase className="w-4 h-4" />,
    },
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the TRUSTY Terms & Verification Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleSelect = (roleId) => {
    setFormData((prev) => ({ ...prev, role: roleId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone,
      bio: formData.bio || (formData.agencyName ? `Brokerage: ${formData.agencyName}` : ''),
      location: {
        city: formData.city || '',
        state: formData.state || '',
        country: 'United States',
      },
    };

    const res = await register(payload);
    setIsSubmitting(false);

    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout
      title="Create Your Verified Account"
      subtitle="Join buyers, tenants, owners, agents, and brokerages on the TRUSTY real estate network."
    >
      <div className="space-y-6 text-slate-900 font-sans">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-[#0b132b] tracking-tight">Create Account</h2>
          <p className="text-xs text-slate-500">
            Select your account type to configure your specialized permissions.
          </p>
        </div>

        {/* 1. ROLE SELECTION GRID */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Select Account Role <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {roles.map((r) => {
              const isSelected = formData.role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleSelect(r.id)}
                  className={`text-left p-3 rounded-2xl border transition-all duration-150 flex items-start gap-2.5 select-none ${
                    isSelected
                      ? 'border-[#0b132b] bg-slate-50 ring-2 ring-slate-900/10 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  } ${r.id === 'agency' ? 'sm:col-span-2' : ''}`}
                >
                  <div
                    className={`p-1.5 rounded-xl border ${
                      isSelected ? 'bg-[#0b132b] text-white border-[#0b132b]' : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {r.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">{r.title}</p>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#0b132b]" />}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{r.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. REGISTRATION FORM */}
        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="First Name"
              name="firstName"
              placeholder="e.g. Eleanor"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
              leftIcon={<UserIcon className="w-4 h-4" />}
            />

            <Input
              label="Last Name"
              name="lastName"
              placeholder="e.g. Vance"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="eleanor@luxury.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>

          {formData.role === 'agency' && (
            <Input
              label="Agency / Brokerage Firm Name"
              name="agencyName"
              placeholder="e.g. Premier Manhattan Realty Group"
              value={formData.agencyName}
              onChange={handleChange}
              helperText="Brokerage licenses will undergo automated verification."
              leftIcon={<Briefcase className="w-4 h-4" />}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="City"
              name="city"
              placeholder="e.g. Miami"
              value={formData.city}
              onChange={handleChange}
              leftIcon={<MapPin className="w-4 h-4" />}
            />
            <Input
              label="State / Region"
              name="state"
              placeholder="e.g. Florida"
              value={formData.state}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Create Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              leftIcon={<Lock className="w-4 h-4" />}
            />
          </div>

          {/* Terms checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#0b132b] focus:ring-slate-900"
              />
              <span>
                I agree to the <span className="text-blue-600 underline font-semibold">Terms of Service</span>, Privacy Policy, and certify that all details are authentic.
              </span>
            </label>
            {errors.termsAccepted && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{errors.termsAccepted}</span>
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isSubmitting}
            rightIcon={<ArrowUpRight className="w-4 h-4" />}
          >
            Complete Registration ({roles.find((r) => r.id === formData.role)?.title})
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have a TRUSTY account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold ml-1 transition-colors">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
