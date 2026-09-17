import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Eye,
  CheckCircle,
  XCircle,
  Ban,
  Trash2,
  RefreshCw,
  Search,
  ShieldAlert,
  Building,
  UserX,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { FilterBar } from '../../components/admin/FilterBar';
import { ConfirmModal, AdminStatCard } from '../../components/admin/ConfirmModal';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const ReportsList = () => {
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reasonFilter, setReasonFilter] = useState('all');

  // Detail Modal
  const [activeReport, setActiveReport] = useState(null);
  // Confirm Modal
  const [confirmData, setConfirmData] = useState({ isOpen: false, title: '', message: '', action: null });

  const toast = useToast();

  const fetchReports = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await adminService.getReports({
        page,
        limit: 10,
        search,
        status: statusFilter,
        reason: reasonFilter,
      });
      setReports(res.data || []);
      if (res.meta) setPagination(res.meta);
    } catch (err) {
      toast.error(err.message || 'Unable to retrieve compliance reports');
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, reasonFilter, toast]);

  useEffect(() => {
    fetchReports(1);
  }, [fetchReports]);

  const handleExecuteAction = (report, actionType) => {
    let actionTitle = '';
    let actionMessage = '';

    switch (actionType) {
      case 'investigate':
        actionTitle = 'Mark as Investigating';
        actionMessage = `Transition report for "${report.propertyTitle}" into Active Investigation?`;
        break;
      case 'resolve':
        actionTitle = 'Mark as Resolved';
        actionMessage = `Resolve report filed by ${report.reporterName}?`;
        break;
      case 'dismiss':
        actionTitle = 'Dismiss Report';
        actionMessage = `Dismiss compliance report as unsubstantiated?`;
        break;
      case 'remove_property':
        actionTitle = 'Remove Reported Property';
        actionMessage = `Permanently delete property "${report.propertyTitle}" from the live marketplace due to verified violations?`;
        break;
      case 'suspend_user':
        actionTitle = 'Suspend Reported User';
        actionMessage = `Immediately suspend account access for ${report.reportedUserName}?`;
        break;
      default:
        return;
    }

    setConfirmData({
      isOpen: true,
      title: actionTitle,
      message: actionMessage,
      variant: actionType === 'remove_property' || actionType === 'suspend_user' ? 'danger' : 'primary',
      action: async () => {
        try {
          await adminService.resolveReportAction(report._id || report.id, { action: actionType });
          toast.success(`Action executed: ${actionTitle}`);
          fetchReports(pagination.page);
          setActiveReport(null);
        } catch (err) {
          toast.error(err.message || 'Action failed');
        }
      },
    });
  };

  const getReasonColor = (reason) => {
    switch (reason) {
      case 'Scam':
        return 'bg-rose-950/80 text-rose-400 border-rose-500/40';
      case 'Fake listing':
        return 'bg-amber-950/80 text-amber-400 border-amber-500/40';
      case 'Duplicate':
        return 'bg-cyan-950/80 text-cyan-400 border-cyan-500/40';
      case 'Incorrect information':
        return 'bg-purple-950/80 text-purple-400 border-purple-500/40';
      case 'Inappropriate content':
        return 'bg-pink-950/80 text-pink-400 border-pink-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-950 text-amber-400 border-amber-500/40';
      case 'Investigating':
        return 'bg-cyan-950 text-cyan-400 border-cyan-500/40';
      case 'Resolved':
        return 'bg-emerald-950 text-emerald-400 border-emerald-500/40';
      case 'Dismissed':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  const columns = [
    {
      header: 'Reporter Details',
      render: (r) => (
        <div className="space-y-0.5">
          <p className="font-bold text-white text-xs">{r.reporterName}</p>
          <p className="text-[11px] text-slate-400">{r.reporterEmail || 'Verified User'}</p>
        </div>
      ),
    },
    {
      header: 'Reported Property & User',
      render: (r) => (
        <div className="space-y-0.5 max-w-xs">
          <Link
            to={r.property ? `/admin/properties/${r.property}` : '#'}
            className="text-xs font-bold text-teal-400 hover:underline truncate block"
          >
            {r.propertyTitle || 'Property Record'}
          </Link>
          <p className="text-[11px] text-slate-400">
            Target User: <strong className="text-slate-300">{r.reportedUserName || '—'}</strong>
          </p>
        </div>
      ),
    },
    {
      header: 'Reported Reason',
      render: (r) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getReasonColor(r.reason)}`}>
          {r.reason}
        </span>
      ),
    },
    {
      header: 'Date Logged',
      render: (r) => (
        <span className="text-slate-400 text-[11px] font-mono">
          {new Date(r.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Lifecycle Status',
      render: (r) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(r.status)}`}>
          {r.status}
        </span>
      ),
    },
    {
      header: 'Admin Actions',
      className: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveReport(r)}
            aria-label="Inspect Full Report"
          >
            <Eye className="w-4 h-4 text-teal-400" />
          </Button>

          {r.status !== 'Investigating' && r.status !== 'Resolved' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleExecuteAction(r, 'investigate')}
              aria-label="Investigate Report"
            >
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
            </Button>
          )}

          {r.status !== 'Resolved' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleExecuteAction(r, 'resolve')}
              aria-label="Resolve Report"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </Button>
          )}

          {r.status !== 'Dismissed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleExecuteAction(r, 'dismiss')}
              aria-label="Dismiss Report"
            >
              <XCircle className="w-4 h-4 text-slate-400" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleExecuteAction(r, 'remove_property')}
            aria-label="Remove Property"
          >
            <Building className="w-4 h-4 text-amber-400" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleExecuteAction(r, 'suspend_user')}
            aria-label="Suspend User"
          >
            <UserX className="w-4 h-4 text-rose-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Compliance & Fraud Reports"
      subtitle="Investigate scams, fake listings, incorrect specs, and execute direct property removals or user suspensions."
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchReports(pagination.page)}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Reports
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdminStatCard
            title="Total Logged Reports"
            value={pagination.total || reports.length}
            subtitle="Platform compliance flags"
            icon={<AlertTriangle className="w-6 h-6" />}
            color="rose"
          />
          <AdminStatCard
            title="Active Investigations"
            value={reports.filter((r) => r.status === 'Investigating' || r.status === 'Pending').length}
            subtitle="Pending auditor resolution"
            icon={<ShieldAlert className="w-6 h-6" />}
            color="amber"
          />
          <AdminStatCard
            title="Resolved & Cleaned"
            value={reports.filter((r) => r.status === 'Resolved').length}
            subtitle="Violations neutralized"
            icon={<CheckCircle className="w-6 h-6" />}
            color="teal"
          />
        </div>

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search report by property title, reporter name, or keywords..."
          filters={[
            {
              label: 'Status',
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: 'all', label: 'All Statuses' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Investigating', label: 'Investigating' },
                { value: 'Resolved', label: 'Resolved' },
                { value: 'Dismissed', label: 'Dismissed' },
              ],
            },
            {
              label: 'Reason',
              value: reasonFilter,
              onChange: setReasonFilter,
              options: [
                { value: 'all', label: 'All Reasons' },
                { value: 'Scam', label: 'Scam' },
                { value: 'Fake listing', label: 'Fake listing' },
                { value: 'Duplicate', label: 'Duplicate' },
                { value: 'Incorrect information', label: 'Incorrect information' },
                { value: 'Inappropriate content', label: 'Inappropriate content' },
                { value: 'Other', label: 'Other' },
              ],
            },
          ]}
          onReset={() => {
            setSearch('');
            setStatusFilter('all');
            setReasonFilter('all');
          }}
        />

        <DataTable
          columns={columns}
          data={reports}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={fetchReports}
          emptyMessage="No reports found matching your criteria."
        />
      </div>

      {/* Detail Inspection Modal */}
      {activeReport && (
        <Modal
          isOpen={Boolean(activeReport)}
          onClose={() => setActiveReport(null)}
          title={`Report Inspection • ${activeReport.reason}`}
          description={`Logged by ${activeReport.reporterName} on ${new Date(activeReport.createdAt).toLocaleString()}`}
          footer={
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => handleExecuteAction(activeReport, 'investigate')}>
                Investigate
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleExecuteAction(activeReport, 'resolve')}>
                Resolve
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleExecuteAction(activeReport, 'remove_property')}>
                Remove Property
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Reported Property</span>
              <p className="text-sm font-bold text-white">{activeReport.propertyTitle}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Report Details & Evidence</span>
              <p className="text-slate-200 leading-relaxed">{activeReport.details}</p>
            </div>

            {activeReport.resolutionNotes && (
              <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-500/30 text-teal-300 space-y-1">
                <span className="font-bold block uppercase text-[10px]">Auditor Resolution Notes</span>
                <p>{activeReport.resolutionNotes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

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
