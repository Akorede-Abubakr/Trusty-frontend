import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Eye, CheckCircle, XCircle, Ban, RefreshCw, Star, Users, Building } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { FilterBar } from '../../components/admin/FilterBar';
import { ConfirmModal, AdminStatCard } from '../../components/admin/ConfirmModal';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

export const AgenciesList = () => {
  const [agencies, setAgencies] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [confirmData, setConfirmData] = useState({ isOpen: false, title: '', message: '', action: null });
  const toast = useToast();
  const navigate = useNavigate();

  const fetchAgencies = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await adminService.getAgencies({
        page,
        limit: 10,
        search,
        verificationStatus: verificationFilter,
        accountStatus: statusFilter,
      });
      setAgencies(res.data || []);
      if (res.meta) setPagination(res.meta);
    } catch (err) {
      toast.error(err.message || 'Unable to retrieve agency brokerages');
    } finally {
      setIsLoading(false);
    }
  }, [search, verificationFilter, statusFilter, toast]);

  useEffect(() => {
    fetchAgencies(1);
  }, [fetchAgencies]);

  const handleVerify = async (agency) => {
    try {
      await adminService.updateAgencyVerification(agency._id || agency.id, 'verified');
      toast.success(`Brokerage "${agency.firstName} ${agency.lastName}" has been verified!`);
      fetchAgencies(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Verification failed');
    }
  };

  const handleReject = async (agency) => {
    try {
      await adminService.updateAgencyVerification(agency._id || agency.id, 'rejected');
      toast.warning(`Brokerage verification marked rejected.`);
      fetchAgencies(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  const handleStatusToggle = (agency) => {
    const newStatus = agency.accountStatus === 'active' ? 'suspended' : 'active';
    setConfirmData({
      isOpen: true,
      title: `${newStatus === 'suspended' ? 'Suspend' : 'Activate'} Brokerage`,
      message: `Set account status to '${newStatus}' for ${agency.firstName} ${agency.lastName}?`,
      variant: newStatus === 'suspended' ? 'danger' : 'primary',
      action: async () => {
        try {
          await adminService.updateAgencyStatus(agency._id || agency.id, newStatus);
          toast.success(`Agency status set to ${newStatus}`);
          fetchAgencies(pagination.page);
        } catch (err) {
          toast.error(err.message || 'Status update failed');
        }
      },
    });
  };

  const columns = [
    {
      header: 'Brokerage Firm',
      render: (a) => (
        <div className="flex items-center gap-3">
          <img
            src={a.profileImage || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=150&q=80'}
            alt={a.firstName}
            className="w-10 h-10 rounded-xl object-cover border border-slate-700"
          />
          <div>
            <Link
              to={`/admin/agencies/${a._id || a.id}`}
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
      header: 'Headquarters Location',
      render: (a) => (
        <span className="text-xs text-slate-300">
          {a.location?.city || 'New York'}, {a.location?.state || 'NY'}
        </span>
      ),
    },
    {
      header: 'Agents & Inventory',
      render: (a) => (
        <div className="space-y-0.5 text-[11px]">
          <p className="text-teal-400 font-semibold">{a.agentsCount || 0} Registered Agents</p>
          <p className="text-slate-400">{a.propertiesCount || 0} Managed Properties</p>
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
            onClick={() => navigate(`/admin/agencies/${a._id || a.id}`)}
            aria-label="View Brokerage"
          >
            <Eye className="w-4 h-4 text-teal-400" />
          </Button>

          {a.verificationStatus !== 'verified' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVerify(a)}
              aria-label="Verify Agency"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </Button>
          )}

          {a.verificationStatus !== 'rejected' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReject(a)}
              aria-label="Reject Agency"
            >
              <XCircle className="w-4 h-4 text-amber-400" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusToggle(a)}
            aria-label="Suspend Agency"
          >
            <Ban className="w-4 h-4 text-slate-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Real Estate Agencies & Brokerages"
      subtitle="Supervise brokerage compliance, verify firm licensing, inspect agent rosters, and govern team accounts."
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchAgencies(pagination.page)}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Agencies
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdminStatCard
            title="Total Brokerages"
            value={pagination.total || agencies.length}
            subtitle="Registered agencies"
            icon={<Briefcase className="w-6 h-6" />}
            color="amber"
          />
          <AdminStatCard
            title="Verified Enterprise Brokerages"
            value={agencies.filter((a) => a.verificationStatus === 'verified').length}
            subtitle="Certified commercial firms"
            icon={<CheckCircle className="w-6 h-6" />}
            color="teal"
          />
          <AdminStatCard
            title="Managed Listings"
            value={agencies.reduce((acc, a) => acc + (a.propertiesCount || 0), 0)}
            subtitle="Under agency representation"
            icon={<Building className="w-6 h-6" />}
            color="cyan"
          />
        </div>

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search brokerage by firm name, email, or city..."
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
          data={agencies}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={fetchAgencies}
          emptyMessage="No brokerages found matching your filter parameters."
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
