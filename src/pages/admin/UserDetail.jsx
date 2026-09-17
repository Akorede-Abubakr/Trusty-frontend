import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  FileText,
  Clock,
  Ban,
  CheckCircle,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { useToast } from '../../context/ToastContext';

export const UserDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmData, setConfirmData] = useState({ isOpen: false, title: '', message: '', action: null });

  const toast = useToast();
  const navigate = useNavigate();

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getUserById(id);
      setData(res.data);
    } catch (err) {
      toast.error(err.message || 'Unable to retrieve user record');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleStatusToggle = () => {
    const user = data?.user;
    if (!user) return;
    const newStatus = user.accountStatus === 'active' ? 'suspended' : 'active';
    const isSuspending = newStatus === 'suspended';

    setConfirmData({
      isOpen: true,
      title: isSuspending ? `Suspend User ${user.firstName}` : `Reactivate User ${user.firstName}`,
      message: `Set account status for ${user.email} to '${newStatus}'?`,
      variant: isSuspending ? 'danger' : 'primary',
      action: async () => {
        try {
          await adminService.updateUserStatus(user._id || user.id, newStatus);
          toast.success(`User status updated to ${newStatus}`);
          fetchDetails();
        } catch (err) {
          toast.error(err.message || 'Status update failed');
        }
      },
    });
  };

  const handleDelete = () => {
    const user = data?.user;
    if (!user) return;

    setConfirmData({
      isOpen: true,
      title: `Delete User ${user.email}`,
      message: 'Are you sure you want to permanently remove this user? All associated sessions will terminate.',
      variant: 'danger',
      action: async () => {
        try {
          await adminService.deleteUser(user._id || user.id);
          toast.success('User has been removed.');
          navigate('/admin/users');
        } catch (err) {
          toast.error(err.message || 'Delete failed');
        }
      },
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="User Record">
        <LoadingSpinner fullPage text="Retrieving comprehensive user details..." />
      </AdminLayout>
    );
  }

  if (!data?.user) {
    return (
      <AdminLayout title="User Not Found">
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <p className="text-sm text-slate-400">User identifier could not be located in directory.</p>
          <Link to="/admin/users">
            <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return to Users Directory
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const { user, properties = [], inquiries = [], viewings = [] } = data;

  return (
    <AdminLayout
      title={`${user.firstName} ${user.lastName}`}
      subtitle={`User Record • ID: ${user._id || user.id}`}
      actions={
        <div className="flex items-center gap-2">
          <Link to="/admin/users">
            <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to List
            </Button>
          </Link>
          <Button
            variant={user.accountStatus === 'active' ? 'danger' : 'primary'}
            size="sm"
            onClick={handleStatusToggle}
            leftIcon={user.accountStatus === 'active' ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
          >
            {user.accountStatus === 'active' ? 'Suspend User' : 'Activate User'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 text-rose-400" />
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Top Profile Summary Card */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row gap-6 items-start">
          <img
            src={user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={user.firstName}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-teal-500/40 shadow-xl"
          />

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-semibold">Assigned Role</span>
              <div><Badge role={user.role} size="md" /></div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-semibold">Account Status</span>
              <div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                    user.accountStatus === 'active'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                  }`}
                >
                  {user.accountStatus}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-semibold">Identity Verification</span>
              <div><Badge variant={user.verificationStatus}>{user.verificationStatus}</Badge></div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-semibold">Registration Date</span>
              <p className="text-white font-medium">
                {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Contact & Bio Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal-400" />
              <span>Contact & Identity Information</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Email Address</span>
                <span className="text-white font-mono">{user.email}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Phone Number</span>
                <span className="text-white font-mono">{user.phone || 'Not Provided'}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Registered Location</span>
                <span className="text-white">
                  {user.location?.city || 'United States'}, {user.location?.state || ''}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Biography & Compliance Metadata</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {user.bio || 'No custom biography provided by this user.'}
            </p>
          </div>
        </div>

        {/* Associated Properties */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-teal-400" />
              <span>Associated Listed Properties ({properties.length})</span>
            </h3>
          </div>

          {properties.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No properties listed under this user account.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map((p) => (
                <div
                  key={p._id || p.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3.5"
                >
                  <img
                    src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
                    alt={p.title}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <Link
                      to={`/admin/properties/${p._id || p.id}`}
                      className="text-xs font-bold text-white hover:text-teal-400 truncate block"
                    >
                      {p.title}
                    </Link>
                    <p className="text-[11px] text-teal-400 font-mono font-semibold">
                      ${p.price?.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <Badge variant={p.verificationStatus} size="sm">
                        {p.verificationStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Associated Inquiries & Scheduled Viewings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inquiries */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Inquiries ({inquiries.length})</span>
            </h3>

            {inquiries.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No inquiry records available.</p>
            ) : (
              <div className="space-y-2">
                {inquiries.map((inq) => (
                  <div key={inq._id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-teal-400 uppercase">{inq.type}</span>
                      <span className="text-slate-400">{new Date(inq.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-200">{inq.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Viewings */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Scheduled Viewings ({viewings.length})</span>
            </h3>

            {viewings.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No active viewing appointments.</p>
            ) : (
              <div className="space-y-2">
                {viewings.map((v) => (
                  <div key={v._id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-amber-400">Scheduled Appointment</span>
                      <span className="text-slate-300 font-mono">
                        {v.scheduledDate ? new Date(v.scheduledDate).toLocaleString() : 'Pending'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{v.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmData.isOpen}
        onClose={() => setConfirmData((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmData.action}
        title={confirmData.title}
        message={confirmData.message}
        variant={confirmData.variant}
      />
    </AdminLayout>
  );
};
