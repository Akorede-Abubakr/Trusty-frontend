import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building,
  Eye,
  CheckCircle,
  XCircle,
  Ban,
  Trash2,
  MapPin,
  RefreshCw,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { FilterBar } from '../../components/admin/FilterBar';
import { ReasonModal } from '../../components/admin/ReasonModal';
import { ConfirmModal, AdminStatCard } from '../../components/admin/ConfirmModal';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

export const PropertiesList = () => {
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Rejection modal
  const [rejectModal, setRejectModal] = useState({ isOpen: false, propertyId: null, title: '' });
  // Confirmation modal
  const [confirmData, setConfirmData] = useState({ isOpen: false, title: '', message: '', action: null });

  const toast = useToast();
  const navigate = useNavigate();

  const fetchProperties = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await adminService.getProperties({
        page,
        limit: 10,
        search,
        status: statusFilter,
        verificationStatus: verificationFilter,
        propertyType: typeFilter,
      });
      setProperties(res.data || []);
      if (res.meta) setPagination(res.meta);
    } catch (err) {
      toast.error(err.message || 'Unable to retrieve property inventory');
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, verificationFilter, typeFilter, toast]);

  useEffect(() => {
    fetchProperties(1);
  }, [fetchProperties]);

  const handleApprove = async (property) => {
    try {
      await adminService.updatePropertyVerification(property._id || property.id, {
        verificationStatus: 'approved',
      });
      toast.success(`Property "${property.title}" has been approved!`);
      fetchProperties(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Approval failed');
    }
  };

  const handleRejectSubmit = async (reason) => {
    if (!rejectModal.propertyId) return;
    try {
      await adminService.updatePropertyVerification(rejectModal.propertyId, {
        verificationStatus: 'rejected',
        rejectionReason: reason,
      });
      toast.warning(`Property marked rejected with reason recorded.`);
      fetchProperties(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Rejection failed');
    }
  };

  const handleSuspendToggle = (property) => {
    const newStatus = property.status === 'available' ? 'suspended' : 'available';
    setConfirmData({
      isOpen: true,
      title: `${newStatus === 'suspended' ? 'Suspend' : 'Activate'} Property`,
      message: `Set property status to '${newStatus}' for "${property.title}"?`,
      variant: newStatus === 'suspended' ? 'danger' : 'primary',
      action: async () => {
        try {
          await adminService.updatePropertyStatus(property._id || property.id, newStatus);
          toast.success(`Property status set to ${newStatus}`);
          fetchProperties(pagination.page);
        } catch (err) {
          toast.error(err.message || 'Status update failed');
        }
      },
    });
  };

  const handleDelete = (property) => {
    setConfirmData({
      isOpen: true,
      title: 'Delete Property Listing',
      message: `Permanently delete "${property.title}"? This cannot be undone.`,
      variant: 'danger',
      action: async () => {
        try {
          await adminService.deleteProperty(property._id || property.id);
          toast.success('Property removed from marketplace.');
          fetchProperties(pagination.page);
        } catch (err) {
          toast.error(err.message || 'Delete failed');
        }
      },
    });
  };

  const columns = [
    {
      header: 'Property Details',
      render: (p) => (
        <div className="flex items-center gap-3.5 max-w-sm">
          <img
            src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
            alt={p.title}
            className="w-14 h-14 rounded-xl object-cover border border-slate-700 flex-shrink-0"
          />
          <div className="min-w-0 space-y-0.5">
            <Link
              to={`/admin/properties/${p._id || p.id}`}
              className="font-bold text-white hover:text-teal-400 truncate block text-xs"
            >
              {p.title}
            </Link>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
              <span className="truncate">{p.location?.city}, {p.location?.state}</span>
            </p>
            {p.reports?.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 font-semibold bg-rose-950/80 px-1.5 py-0.2 rounded border border-rose-500/30">
                <AlertTriangle className="w-3 h-3" />
                <span>{p.reports.length} Flagged Report(s)</span>
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Valuation & Price',
      render: (p) => (
        <div>
          <p className="font-bold text-teal-400 font-mono text-xs">
            ${p.price?.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">
            {p.listingType}
          </span>
        </div>
      ),
    },
    {
      header: 'Category & Type',
      render: (p) => (
        <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-semibold text-[11px] capitalize border border-slate-700">
          {p.propertyType}
        </span>
      ),
    },
    {
      header: 'Stakeholders',
      render: (p) => (
        <div className="space-y-0.5 text-[11px]">
          <p className="text-slate-300 truncate">
            <span className="text-slate-500">Owner:</span> {p.ownerDetails?.name || 'Private Owner'}
          </p>
          <p className="text-teal-400 truncate">
            <span className="text-slate-500">Agent:</span> {p.agentDetails?.name || 'Assigned'}
          </p>
        </div>
      ),
    },
    {
      header: 'Verification & Moderation',
      render: (p) => (
        <div className="space-y-1">
          <Badge variant={p.verificationStatus} size="sm">
            {p.verificationStatus}
          </Badge>
          {p.rejectionReason && (
            <p className="text-[10px] text-rose-300 max-w-[140px] truncate" title={p.rejectionReason}>
              {p.rejectionReason}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Status & Views',
      render: (p) => (
        <div className="space-y-0.5">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              p.status === 'available'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                : 'bg-rose-950 text-rose-400 border border-rose-500/40'
            }`}
          >
            {p.status}
          </span>
          <p className="text-[10px] text-slate-400">{p.views || 0} views</p>
        </div>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/admin/properties/${p._id || p.id}`)}
            aria-label="Inspect Property"
          >
            <Eye className="w-4 h-4 text-teal-400" />
          </Button>

          {p.verificationStatus !== 'approved' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleApprove(p)}
              aria-label="Approve Property"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </Button>
          )}

          {p.verificationStatus !== 'rejected' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setRejectModal({
                  isOpen: true,
                  propertyId: p._id || p.id,
                  title: `Reject Listing: ${p.title}`,
                })
              }
              aria-label="Reject Property"
            >
              <XCircle className="w-4 h-4 text-amber-400" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSuspendToggle(p)}
            aria-label="Suspend Property"
          >
            <Ban className="w-4 h-4 text-slate-400" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(p)}
            aria-label="Delete Property"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Property Inventory & Moderation"
      subtitle="Inspect titles, architectural descriptions, reports, valuations, and approve or reject submissions."
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchProperties(pagination.page)}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Inventory
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdminStatCard
            title="Total Property Inventory"
            value={pagination.total || properties.length}
            subtitle="Indexed across regions"
            icon={<Building className="w-6 h-6" />}
            color="teal"
          />
          <AdminStatCard
            title="Approved Live Listings"
            value={properties.filter((p) => p.verificationStatus === 'approved').length}
            subtitle="Verified title guarantee"
            icon={<CheckCircle className="w-6 h-6" />}
            color="cyan"
          />
          <AdminStatCard
            title="Moderation Queue"
            value={properties.filter((p) => p.verificationStatus === 'pending' || p.reports?.length > 0).length}
            subtitle="Awaiting compliance check"
            icon={<AlertTriangle className="w-6 h-6" />}
            color="amber"
          />
        </div>

        {/* Filter Bar */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by property title, city, or address..."
          filters={[
            {
              label: 'Verification',
              value: verificationFilter,
              onChange: setVerificationFilter,
              options: [
                { value: 'all', label: 'All Verifications' },
                { value: 'approved', label: 'Approved' },
                { value: 'pending', label: 'Pending Review' },
                { value: 'rejected', label: 'Rejected' },
              ],
            },
            {
              label: 'Status',
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: 'all', label: 'All Statuses' },
                { value: 'available', label: 'Available' },
                { value: 'suspended', label: 'Suspended' },
                { value: 'sold', label: 'Sold' },
                { value: 'rented', label: 'Rented' },
              ],
            },
            {
              label: 'Property Type',
              value: typeFilter,
              onChange: setTypeFilter,
              options: [
                { value: 'all', label: 'All Types' },
                { value: 'villa', label: 'Villa' },
                { value: 'penthouse', label: 'Penthouse' },
                { value: 'apartment', label: 'Apartment' },
                { value: 'residential', label: 'Residential' },
              ],
            },
          ]}
          onReset={() => {
            setSearch('');
            setStatusFilter('all');
            setVerificationFilter('all');
            setTypeFilter('all');
          }}
        />

        {/* Dynamic Data Table */}
        <DataTable
          columns={columns}
          data={properties}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={fetchProperties}
          emptyMessage="No properties found matching your moderation criteria."
        />
      </div>

      {/* Required Rejection Reason Modal */}
      <ReasonModal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, propertyId: null, title: '' })}
        onSubmit={handleRejectSubmit}
        title={rejectModal.title}
      />

      {/* Confirmation Modal */}
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
