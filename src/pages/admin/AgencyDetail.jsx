import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  Building,
  Users,
  Star,
  CheckCircle,
  XCircle,
  Ban,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { useToast } from '../../context/ToastContext';

export const AgencyDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmData, setConfirmData] = useState({ isOpen: false, title: '', message: '', action: null });

  const toast = useToast();
  const navigate = useNavigate();

  const fetchAgency = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getAgencyById(id);
      setData(res.data);
    } catch (err) {
      toast.error(err.message || 'Unable to retrieve agency details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgency();
  }, [id]);

  const handleVerify = async (status) => {
    try {
      await adminService.updateAgencyVerification(id, status);
      toast.success(`Agency verification status updated to '${status}'.`);
      fetchAgency();
    } catch (err) {
      toast.error(err.message || 'Verification update failed');
    }
  };

  const handleStatusToggle = () => {
    const agency = data?.agency;
    if (!agency) return;
    const newStatus = agency.accountStatus === 'active' ? 'suspended' : 'active';

    setConfirmData({
      isOpen: true,
      title: `${newStatus === 'suspended' ? 'Suspend' : 'Activate'} Brokerage Firm`,
      message: `Set account status for "${agency.firstName} ${agency.lastName}" to '${newStatus}'?`,
      variant: newStatus === 'suspended' ? 'danger' : 'primary',
      action: async () => {
        try {
          await adminService.updateAgencyStatus(id, newStatus);
          toast.success(`Agency status set to ${newStatus}`);
          fetchAgency();
        } catch (err) {
          toast.error(err.message || 'Status update failed');
        }
      },
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Agency Record">
        <LoadingSpinner fullPage text="Retrieving brokerage enterprise details & agent roster..." />
      </AdminLayout>
    );
  }

  if (!data?.agency) {
    return (
      <AdminLayout title="Agency Not Found">
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <p className="text-sm text-slate-400">Brokerage identifier could not be located in registry.</p>
          <Link to="/admin/agencies">
            <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return to Agencies Directory
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const { agency, agents = [], properties = [], reviews = [] } = data;

  return (
    <AdminLayout
      title={`${agency.firstName} ${agency.lastName}`}
      subtitle={`Brokerage Firm Record • ID: ${agency._id || agency.id}`}
      actions={
        <div className="flex items-center gap-2">
          <Link to="/admin/agencies">
            <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Agencies
            </Button>
          </Link>

          {agency.verificationStatus !== 'verified' && (
            <Button variant="primary" size="sm" onClick={() => handleVerify('verified')} leftIcon={<CheckCircle className="w-4 h-4" />}>
              Verify Brokerage
            </Button>
          )}

          {agency.verificationStatus !== 'rejected' && (
            <Button variant="outline" size="sm" onClick={() => handleVerify('rejected')} leftIcon={<XCircle className="w-4 h-4 text-amber-400" />}>
              Reject Verification
            </Button>
          )}

          <Button
            variant={agency.accountStatus === 'active' ? 'danger' : 'primary'}
            size="sm"
            onClick={handleStatusToggle}
            leftIcon={<Ban className="w-3.5 h-3.5" />}
          >
            {agency.accountStatus === 'active' ? 'Suspend Firm' : 'Activate Firm'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Company Header Card */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row gap-6 items-start">
          <img
            src={agency.profileImage || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=200&q=80'}
            alt={agency.firstName}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-500/40 shadow-xl"
          />

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-semibold">Verification</span>
              <div><Badge variant={agency.verificationStatus}>{agency.verificationStatus}</Badge></div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-semibold">Headquarters</span>
              <p className="text-white font-bold">{agency.location?.address || '1334 York Avenue'}</p>
              <p className="text-slate-400">{agency.location?.city || 'New York'}, {agency.location?.state || 'NY'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-semibold">Contact Email</span>
              <p className="text-white font-mono">{agency.email}</p>
              <p className="text-slate-400">{agency.phone || '—'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-semibold">Firm Status</span>
              <div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    agency.accountStatus === 'active'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                  }`}
                >
                  {agency.accountStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Company Bio */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Firm Overview & Operations</h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            {agency.bio || 'No custom brokerage biography provided.'}
          </p>
        </div>

        {/* Registered Agent Roster */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Registered Agent Roster ({agents.length})</span>
          </h3>

          {agents.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No individual agents registered under this brokerage.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((ag) => (
                <div key={ag._id || ag.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3.5">
                  <img
                    src={ag.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'}
                    alt={ag.firstName}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <Link to={`/admin/agents/${ag._id || ag.id}`} className="text-xs font-bold text-white hover:text-teal-400 truncate block">
                      {ag.firstName} {ag.lastName}
                    </Link>
                    <p className="text-[11px] text-slate-400 truncate">{ag.email}</p>
                    <Badge variant={ag.verificationStatus} size="sm">{ag.verificationStatus}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Managed Properties & Verified Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Properties */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-teal-400" />
              <span>Managed Properties Portfolio ({properties.length})</span>
            </h3>

            {properties.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No property inventory currently assigned to this brokerage.</p>
            ) : (
              <div className="space-y-2.5">
                {properties.map((p) => (
                  <div key={p._id || p.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <Link to={`/admin/properties/${p._id || p.id}`} className="text-xs font-bold text-white hover:text-teal-400 truncate block">
                        {p.title}
                      </Link>
                      <p className="text-[11px] text-teal-400 font-mono">${p.price?.toLocaleString()}</p>
                    </div>
                    <Badge variant={p.verificationStatus} size="sm">{p.verificationStatus}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Brokerage Ratings & Reviews ({reviews.length})</span>
            </h3>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No client reviews submitted for this brokerage yet.</p>
            ) : (
              <div className="space-y-2.5">
                {reviews.map((r) => (
                  <div key={r._id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{r.authorName}</span>
                      <div className="flex gap-0.5 text-amber-400">
                        {[...Array(r.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{r.comment}</p>
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
