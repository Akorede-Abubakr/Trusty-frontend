import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Eye, Ban, CheckCircle, Trash2, RefreshCw, UserCheck, ShieldAlert } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { FilterBar } from '../../components/admin/FilterBar';
import { ConfirmModal, AdminStatCard } from '../../components/admin/ConfirmModal';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

export const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Confirmation modal state
  const [confirmData, setConfirmData] = useState({
    isOpen: false,
    title: '',
    message: '',
    action: null,
    variant: 'danger',
  });

  const toast = useToast();
  const navigate = useNavigate();

  const fetchUsers = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await adminService.getUsers({
        page,
        limit: 10,
        search,
        role: roleFilter,
        status: statusFilter,
      });
      setUsers(res.data || []);
      if (res.meta) {
        setPagination(res.meta);
      }
    } catch (err) {
      toast.error(err.message || 'Unable to retrieve user registry');
    } finally {
      setIsLoading(false);
    }
  }, [search, roleFilter, statusFilter, toast]);

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  const handleStatusToggle = (user) => {
    const newStatus = user.accountStatus === 'active' ? 'suspended' : 'active';
    const isSuspending = newStatus === 'suspended';

    setConfirmData({
      isOpen: true,
      title: isSuspending ? `Suspend User ${user.firstName}` : `Reactivate User ${user.firstName}`,
      message: isSuspending
        ? `Are you sure you want to suspend access for ${user.email}? They will not be able to log in or manage listings.`
        : `Reactivate access for ${user.email}?`,
      variant: isSuspending ? 'danger' : 'primary',
      action: async () => {
        try {
          await adminService.updateUserStatus(user._id || user.id, newStatus);
          toast.success(`User status updated to ${newStatus}`);
          fetchUsers(pagination.page);
        } catch (err) {
          toast.error(err.message || 'Could not update user status');
        }
      },
    });
  };

  const handleDeleteUser = (user) => {
    setConfirmData({
      isOpen: true,
      title: `Delete User Account`,
      message: `Are you sure you want to permanently delete user ${user.email}? This action cannot be undone.`,
      variant: 'danger',
      action: async () => {
        try {
          await adminService.deleteUser(user._id || user.id);
          toast.success(`User ${user.email} was removed successfully.`);
          fetchUsers(pagination.page);
        } catch (err) {
          toast.error(err.message || 'Could not delete user');
        }
      },
    });
  };

  const columns = [
    {
      header: 'User Profile',
      render: (u) => (
        <div className="flex items-center gap-3">
          <img
            src={u.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={u.firstName}
            className="w-10 h-10 rounded-xl object-cover border border-slate-700"
          />
          <div>
            <Link
              to={`/admin/users/${u._id || u.id}`}
              className="font-bold text-white hover:text-teal-400 transition-colors"
            >
              {u.firstName} {u.lastName}
            </Link>
            <p className="text-[11px] text-slate-400">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Role',
      render: (u) => <Badge role={u.role} size="sm" />,
    },
    {
      header: 'Contact Phone',
      render: (u) => <span className="text-slate-300 font-mono text-[11px]">{u.phone || '—'}</span>,
    },
    {
      header: 'Verification Status',
      render: (u) => <Badge variant={u.verificationStatus}>{u.verificationStatus}</Badge>,
    },
    {
      header: 'Account Status',
      render: (u) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            u.accountStatus === 'active'
              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
              : 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
          }`}
        >
          {u.accountStatus}
        </span>
      ),
    },
    {
      header: 'Registration Date',
      render: (u) => (
        <span className="text-slate-400 text-[11px]">
          {new Date(u.createdAt || Date.now()).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (u) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/admin/users/${u._id || u.id}`)}
            aria-label="View user profile"
          >
            <Eye className="w-4 h-4 text-teal-400" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStatusToggle(u)}
            aria-label={u.accountStatus === 'active' ? 'Suspend User' : 'Activate User'}
          >
            {u.accountStatus === 'active' ? (
              <Ban className="w-4 h-4 text-amber-400" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteUser(u)}
            aria-label="Delete User"
          >
            <Trash2 className="w-4 h-4 text-rose-400 hover:text-rose-300" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="User Management Directory"
      subtitle="Search, filter, inspect associated properties & inquiries, and govern user statuses across all 6 roles."
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchUsers(pagination.page)}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Registry
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdminStatCard
            title="Total Registered Users"
            value={pagination.total || users.length}
            subtitle="Across 6 permission tiers"
            icon={<Users className="w-6 h-6" />}
            color="teal"
          />
          <AdminStatCard
            title="Active Operational Accounts"
            value={users.filter((u) => u.accountStatus === 'active').length}
            subtitle="Fully authorized users"
            icon={<UserCheck className="w-6 h-6" />}
            color="cyan"
          />
          <AdminStatCard
            title="Suspended Accounts"
            value={users.filter((u) => u.accountStatus === 'suspended').length}
            subtitle="Requires compliance review"
            icon={<ShieldAlert className="w-6 h-6" />}
            color="rose"
          />
        </div>

        {/* Filter and Search Bar */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name, email, or phone number..."
          filters={[
            {
              label: 'Role',
              value: roleFilter,
              onChange: setRoleFilter,
              options: [
                { value: 'all', label: 'All Roles' },
                { value: 'buyer', label: 'Buyers' },
                { value: 'renter', label: 'Renters' },
                { value: 'owner', label: 'Owners' },
                { value: 'agent', label: 'Agents' },
                { value: 'agency', label: 'Agencies' },
                { value: 'admin', label: 'Admins' },
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
                { value: 'deactivated', label: 'Deactivated' },
              ],
            },
          ]}
          onReset={() => {
            setSearch('');
            setRoleFilter('all');
            setStatusFilter('all');
          }}
        />

        {/* Dynamic Data Table */}
        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={fetchUsers}
          emptyMessage="No users found matching your active filters."
        />
      </div>

      {/* Confirmation Dialog */}
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
