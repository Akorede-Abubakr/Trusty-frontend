import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Eye, CheckCircle, XCircle, Ban, RefreshCw, Star, Building, Users } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { FilterBar } from '../../components/admin/FilterBar';
import { ConfirmModal, AdminStatCard } from '../../components/admin/ConfirmModal';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

export const AgentsList = () => {
  const [agents, setAgents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [confirmData, setConfirmData] = useState({ isOpen: false, title: '', message: '', action: null });
  const toast = useToast();
  const navigate = useNavigate();

  const fetchAgents = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await adminService.getAgents({
        page,
        limit: 10,
        search,
        verificationStatus: verificationFilter,
        accountStatus: statusFilter,
      });
      setAgents(res.data || []);
      if (res.meta) setPagination(res.meta);
    } catch (err) {
      toast.error(err.message || 'Unable to retrieve agent directory');
    } finally {
      setIsLoading(false);
    }
  }, [search, verificationFilter, statusFilter, toast]);

  useEffect(() => {
    fetchAgents(1);
  }, [fetchAgents]);

  const handleVerify = async (agent) => {
    try {
      await adminService.updateAgentVerification(agent._id || agent.id, 'verified');
      toast.success(`Agent ${agent.firstName} has been officially verified!`);
      fetchAgents(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Verification failed');
    }
  };

  const handleRejectVerification = async (agent) => {
    try {
      await adminService.updateAgentVerification(agent._id || agent.id, 'rejected');
      toast.warning(`Agent ${agent.firstName}'s verification request was rejected.`);
      fetchAgents(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  const handleStatusToggle = (agent) => {
    const newStatus = agent.accountStatus === 'active' ? 'suspended' : 'active';
    setConfirmData({
      isOpen: true,
      title: `${newStatus === 'suspended' ? 'Suspend' : 'Reactivate'} Agent Account`,
      message: `Set account status for ${agent.firstName} ${agent.lastName} to '${newStatus}'?`,
      variant: newStatus === 'suspended' ? 'danger' : 'primary',
      action: async () => {
        try {
          await adminService.updateAgentStatus(agent._id || agent.id, newStatus);
          toast.success(`Agent status updated to ${newStatus}`);
          fetchAgents(pagination.page);
        } catch (err) {
          toast.error(err.message || 'Status update failed');
        }
      },
    });
  };

  const columns = [
    {
      header: 'Licensed Agent',
      render: (a) => (
        <div className="flex items-center gap-3">
          <img
            src={a.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'}
            alt={a.firstName}
            className="w-10 h-10 rounded-xl object-cover border border-slate-700"
          />
          <div>
            <Link
              to={`/admin/agents/${a._id || a.id}`}
              className="font-bold text-white hover:text-teal-400 transition-colors"
            >
              {a.firstName} {a.lastName}
            </Link>
            <p className="text-[11px] text-slate-400">{a.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Agency Brokerage',
      render: (a) => <span className="text-xs text-slate-300 font-medium">{a.agencyName}</span>,
    },
    {
      header: 'Portfolio & Reviews',
      render: (a) => (
        <div className="space-y-0.5 text-[11px]">
          <p className="text-teal-400 font-semibold">{a.propertiesCount || 0} Listed Properties</p>
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3 h-3 fill-current" />
            <span>{a.averageRating} ({a.reviewsCount || 0} reviews)</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Verification Status',
      render: (a) => <Badge variant={a.verificationStatus}>{a.verificationStatus}</Badge>,
    },
    {
      header: 'Account Status',
      render: (a) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
            a.accountStatus === 'active'
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
              : 'bg-rose-950 text-rose-400 border border-rose-500/40'
          }`}
        >
          {a.accountStatus}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (a) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/admin/agents/${a._id || a.id}`)}
            aria-label="View Profile"
          >
            <Eye className="w-4 h-4 text-teal-400" />
          </Button>

          {a.verificationStatus !== 'verified' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVerify(a)}
              aria-label="Verify Agent"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </Button>
          )}

          {a.verificationStatus !== 'rejected' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRejectVerification(a)}
              aria-label="Reject Agent Verification"
            >
              <XCircle className="w-4 h-4 text-amber-400" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusToggle(a)}
            aria-label="Suspend / Activate"
          >
            <Ban className="w-4 h-4 text-slate-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Licensed Agents Management"
      subtitle="Verify credentials, audit portfolios, oversee client reviews, and manage agent statuses."
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchAgents(pagination.page)}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Directory
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdminStatCard
            title="Total Registered Agents"
            value={pagination.total || agents.length}
            subtitle="Verified real estate network"
            icon={<Award className="w-6 h-6" />}
            color="teal"
          />
          <AdminStatCard
            title="Certified & Verified Agents"
            value={agents.filter((a) => a.verificationStatus === 'verified').length}
            subtitle="Identity & license verified"
            icon={<CheckCircle className="w-6 h-6" />}
            color="cyan"
          />
          <AdminStatCard
            title="Pending Verification Queue"
            value={agents.filter((a) => a.verificationStatus === 'pending').length}
            subtitle="Awaiting compliance review"
            icon={<Users className="w-6 h-6" />}
            color="amber"
          />
        </div>

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search agent by name, email, or city..."
          filters={[
            {
              label: 'Verification',
              value: verificationFilter,
              onChange: setVerificationFilter,
              options: [
                { value: 'all', label: 'All Verifications' },
                { value: 'verified', label: 'Verified' },
                { value: 'pending', label: 'Pending Review' },
                { value: 'rejected', label: 'Rejected' },
              ],
            },
            {
              label: 'Account Status',
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: 'all', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'suspended', label: 'Suspended' },
              ],
            },
          ]}
          onReset={() => {
            setSearch('');
            setVerificationFilter('all');
            setStatusFilter('all');
          }}
        />

        <DataTable
          columns={columns}
          data={agents}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={fetchAgents}
          emptyMessage="No licensed agents found matching your filter criteria."
        />
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
