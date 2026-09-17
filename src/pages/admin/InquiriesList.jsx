import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, RefreshCw, Eye, CheckCircle2, Clock, MapPin, User, ChevronDown } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { FilterBar } from '../../components/admin/FilterBar';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { AdminStatCard } from '../../components/admin/ConfirmModal';
import { useToast } from '../../context/ToastContext';

export const InquiriesList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [activeInquiry, setActiveInquiry] = useState(null);
  const toast = useToast();

  const fetchInquiries = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await adminService.getInquiries({
        page,
        limit: 10,
        search,
        status: statusFilter,
      });
      setInquiries(res.data || []);
      if (res.meta) setPagination(res.meta);
    } catch (err) {
      toast.error(err.message || 'Unable to retrieve customer inquiries');
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, toast]);

  useEffect(() => {
    fetchInquiries(1);
  }, [fetchInquiries]);

  const handleUpdateStatus = async (inquiryId, newStatus) => {
    try {
      await adminService.updateInquiryStatus(inquiryId, newStatus);
      toast.success(`Inquiry status updated to '${newStatus}'`);
      fetchInquiries(pagination.page);
      if (activeInquiry) {
        setActiveInquiry((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toast.error(err.message || 'Status update failed');
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'New':
        return 'bg-cyan-950 text-cyan-400 border-cyan-500/40';
      case 'Contacted':
        return 'bg-indigo-950 text-indigo-400 border-indigo-500/40';
      case 'Viewing Scheduled':
        return 'bg-amber-950 text-amber-400 border-amber-500/40';
      case 'Interested':
        return 'bg-teal-950 text-teal-400 border-teal-500/40';
      case 'Closed':
        return 'bg-emerald-950 text-emerald-400 border-emerald-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const columns = [
    {
      header: 'Property Listing',
      render: (i) => (
        <div className="space-y-0.5 max-w-xs">
          <Link
            to={i.property ? `/admin/properties/${i.property}` : '#'}
            className="text-xs font-bold text-white hover:text-teal-400 truncate block"
          >
            {i.propertyTitle || 'Property Record'}
          </Link>
          <span className="text-[10px] text-teal-400 font-bold uppercase">{i.type}</span>
        </div>
      ),
    },
    {
      header: 'Sender / Customer',
      render: (i) => (
        <div className="space-y-0.5">
          <p className="font-bold text-white text-xs">{i.senderName || i.customerName || 'Inquiring Buyer'}</p>
          <p className="text-[11px] text-slate-400">{i.senderEmail || i.customerEmail || '—'}</p>
        </div>
      ),
    },
    {
      header: 'Recipient / Agent',
      render: (i) => <span className="text-slate-300 text-xs font-semibold">{i.recipientName || i.agentName || 'Listing Agent'}</span>,
    },
    {
      header: 'Inquiry Message',
      render: (i) => (
        <p className="text-slate-300 text-xs max-w-xs truncate" title={i.message}>
          "{i.message}"
        </p>
      ),
    },
    {
      header: 'Status',
      render: (i) => (
        <select
          value={i.status}
          onChange={(e) => handleUpdateStatus(i._id || i.id, e.target.value)}
          className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border focus:outline-none ${getStatusBadgeColor(
            i.status
          )}`}
        >
          {['New', 'Contacted', 'Viewing Scheduled', 'Interested', 'Closed'].map((st) => (
            <option key={st} value={st} className="bg-slate-900 text-white">
              {st}
            </option>
          ))}
        </select>
      ),
    },
    {
      header: 'Date Logged',
      render: (i) => (
        <span className="text-slate-400 text-[11px] font-mono">
          {new Date(i.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (i) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveInquiry(i)}
          aria-label="View Inquiry Details"
        >
          <Eye className="w-4 h-4 text-teal-400" />
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Customer Inquiries & Client Leads"
      subtitle="Track buyer and tenant inquiries, oversee agent responsiveness, and update sales pipeline stages."
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchInquiries(pagination.page)}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Inquiries
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdminStatCard
            title="Total Active Inquiries"
            value={pagination.total || inquiries.length}
            subtitle="Customer inquiries recorded"
            icon={<MessageSquare className="w-6 h-6" />}
            color="teal"
          />
          <AdminStatCard
            title="New & Uncontacted"
            value={inquiries.filter((i) => i.status === 'New').length}
            subtitle="Pending immediate agent callback"
            icon={<Clock className="w-6 h-6" />}
            color="cyan"
          />
          <AdminStatCard
            title="Closed / Deals Secured"
            value={inquiries.filter((i) => i.status === 'Closed' || i.status === 'Interested').length}
            subtitle="High-intent transactions"
            icon={<CheckCircle2 className="w-6 h-6" />}
            color="amber"
          />
        </div>

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by property, customer name, agent, or message..."
          filters={[
            {
              label: 'Inquiry Status',
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: 'all', label: 'All Inquiries' },
                { value: 'New', label: 'New' },
                { value: 'Contacted', label: 'Contacted' },
                { value: 'Viewing Scheduled', label: 'Viewing Scheduled' },
                { value: 'Interested', label: 'Interested' },
                { value: 'Closed', label: 'Closed' },
              ],
            },
          ]}
          onReset={() => {
            setSearch('');
            setStatusFilter('all');
          }}
        />

        <DataTable
          columns={columns}
          data={inquiries}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={fetchInquiries}
          emptyMessage="No customer inquiries found matching your filter criteria."
        />
      </div>

      {/* Inquiry Inspector Modal */}
      {activeInquiry && (
        <Modal
          isOpen={Boolean(activeInquiry)}
          onClose={() => setActiveInquiry(null)}
          title={`Inquiry from ${activeInquiry.senderName || activeInquiry.customerName}`}
          description={`Property: ${activeInquiry.propertyTitle}`}
          footer={
            <Button variant="primary" size="sm" onClick={() => setActiveInquiry(null)}>
              Done
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Client Contact:</span>
                <p className="text-white font-mono">{activeInquiry.senderPhone || activeInquiry.customerPhone || '—'}</p>
                <p className="text-slate-400">{activeInquiry.senderEmail || activeInquiry.customerEmail}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Assigned Agent:</span>
                <p className="text-teal-400 font-bold">{activeInquiry.recipientName || activeInquiry.agentName}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Full Message Content</span>
              <p className="text-slate-200 text-sm leading-relaxed">"{activeInquiry.message}"</p>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
};
