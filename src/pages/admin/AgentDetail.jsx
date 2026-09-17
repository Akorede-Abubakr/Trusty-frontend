import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  Mail,
  Phone,
  Building,
  Star,
  CheckCircle,
  XCircle,
  Ban,
  Clock,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { useToast } from '../../context/ToastContext';

export const AgentDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmData, setConfirmData] = useState({ isOpen: false, title: '', message: '', action: null });

  const toast = useToast();
  const navigate = useNavigate();

  const fetchAgent = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getAgentById(id);
      setData(res.data);
    } catch (err) {
      toast.error(err.message || 'Unable to retrieve agent record');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgent();
  }, [id]);

  const handleVerify = async (status) => {
    try {
      await adminService.updateAgentVerification(id, status);
      toast.success(`Agent verification status updated to '${status}'.`);
      fetchAgent();
    } catch (err) {
      toast.error(err.message || 'Verification update failed');
    }
  };

  const handleStatusToggle = () => {
    const agent = data?.agent;
    if (!agent) return;
    const newStatus = agent.accountStatus === 'active' ? 'suspended' : 'active';

    setConfirmData({
      isOpen: true,
      title: `${newStatus === 'suspended' ? 'Suspend' : 'Activate'} Agent Account`,
      message: `Set status to '${newStatus}' for ${agent.firstName} ${agent.lastName}?`,
      variant: newStatus === 'suspended' ? 'danger' : 'primary',
      action: async () => {
        try {
          await adminService.updateAgentStatus(id, newStatus);
          toast.success(`Agent status set to ${newStatus}`);
          fetchAgent();
        } catch (err) {
          toast.error(err.message || 'Status update failed');
        }
      },
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Agent Record">
        <LoadingSpinner fullPage text="Retrieving licensed agent credentials and listings..." />
      </AdminLayout>
    );
  }

  if (!data?.agent) {
    return (
      <AdminLayout title="Agent Not Found">
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <p className="text-sm text-slate-400">Agent identifier could not be located in registry.</p>
          <Link to="/admin/agents">
            <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return to Agents Directory
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const { agent, agency, properties = [], reviews = [], inquiries = [] } = data;

  return (
    <AdminLayout
      title={`${agent.firstName} ${agent.lastName}`}
      subtitle={`Licensed Real Estate Agent • ID: ${agent._id || agent.id}`}
      actions={
        <div className="flex items-center gap-2">
          <Link to="/admin/agents">
            <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Agents
            </Button>
          </Link>

          {agent.verificationStatus !== 'verified' && (
            <Button variant="primary" size="sm" onClick={() => handleVerify('verified')} leftIcon={<CheckCircle className="w-4 h-4" />}>
              Verify Agent
            </Button>
          )}

          {agent.verificationStatus !== 'rejected' && (
            <Button variant="outline" size="sm" onClick={() => handleVerify('rejected')} leftIcon={<XCircle className="w-4 h-4 text-amber-400" />}>
              Reject Verification
            </Button>
          )}

          <Button
            variant={agent.accountStatus === 'active' ? 'danger' : 'primary'}
            size="sm"
            onClick={handleStatusToggle}
            leftIcon={<Ban className="w-3.5 h-3.5" />}
          >
            {agent.accountStatus === 'active' ? 'Suspend Account' : 'Activate Account'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row gap-6 items-start">
          <img
            src={agent.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'}
            alt={agent.firstName}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-teal-500/40 shadow-xl"
          />

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-semibold">Verification Status</span>
              <div><Badge variant={agent.verificationStatus}>{agent.verificationStatus}</Badge></div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-semibold">Affiliated Brokerage</span>
              <p className="text-white font-bold">{agency ? `${agency.firstName} ${agency.lastName}` : 'Independent Agent'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-semibold">Phone & Location</span>
              <p className="text-white font-mono">{agent.phone || '—'}</p>
              <p className="text-slate-400">{agent.location?.city || 'United States'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-semibold">Account Status</span>
              <div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    agent.accountStatus === 'active'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                  }`}
                >
                  {agent.accountStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Agent Biography & Specialization</h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            {agent.bio || 'No custom agent bio provided.'}
          </p>
        </div>

        {/* Active Property Listings */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-teal-400" />
            <span>Agent Property Listings ({properties.length})</span>
          </h3>

          {properties.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No active listings represented by this agent.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map((p) => (
                <div key={p._id || p.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3.5">
                  <img
                    src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
                    alt={p.title}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <Link to={`/admin/properties/${p._id || p.id}`} className="text-xs font-bold text-white hover:text-teal-400 truncate block">
                      {p.title}
                    </Link>
                    <p className="text-[11px] text-teal-400 font-mono font-semibold">${p.price?.toLocaleString()}</p>
                    <Badge variant={p.verificationStatus} size="sm">{p.verificationStatus}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews & Client Inquiries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reviews */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Verified Client Reviews ({reviews.length})</span>
            </h3>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No verified client reviews submitted yet.</p>
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

          {/* Inquiries */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>Client Inquiries Handled ({inquiries.length})</span>
            </h3>

            {inquiries.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No client inquiries assigned to this agent.</p>
            ) : (
              <div className="space-y-2.5">
                {inquiries.map((inq) => (
                  <div key={inq._id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal-400 uppercase text-[10px]">{inq.type}</span>
                      <span className="text-slate-400 text-[10px]">{new Date(inq.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-200">{inq.message}</p>
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
