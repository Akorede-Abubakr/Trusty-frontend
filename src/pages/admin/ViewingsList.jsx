import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, RefreshCw, Eye, XCircle, CheckCircle2, User, Building, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { FilterBar } from '../../components/admin/FilterBar';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { AdminStatCard, ConfirmModal } from '../../components/admin/ConfirmModal';
import { useToast } from '../../context/ToastContext';

export const ViewingsList = () => {
  const [viewings, setViewings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Reschedule Modal
  const [rescheduleModal, setRescheduleModal] = useState({
    isOpen: false,
    viewingId: null,
    date: '',
    time: '',
    notes: '',
  });

  // Confirm Modal
  const [confirmData, setConfirmData] = useState({ isOpen: false, title: '', message: '', action: null });
  // View Details Modal
  const [activeViewing, setActiveViewing] = useState(null);

  const toast = useToast();

  const fetchViewings = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await adminService.getViewings({
        page,
        limit: 10,
        search,
        status: statusFilter,
      });
      setViewings(res.data || []);
      if (res.meta) setPagination(res.meta);
    } catch (err) {
      toast.error(err.message || 'Unable to retrieve viewing appointments');
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, toast]);

  useEffect(() => {
    fetchViewings(1);
  }, [fetchViewings]);

  const handleStatusUpdate = async (viewingId, newStatus) => {
    try {
      await adminService.updateViewingStatus(viewingId, newStatus);
      toast.success(`Viewing appointment marked as '${newStatus}'`);
      fetchViewings(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  };

  const handleCancelViewing = (v) => {
    setConfirmData({
      isOpen: true,
      title: 'Cancel Viewing Appointment',
      message: `Cancel viewing for ${v.customerName} on "${v.propertyTitle}"?`,
      variant: 'danger',
      action: async () => {
        try {
          await adminService.updateViewingStatus(v._id || v.id, 'Cancelled');
          toast.success('Viewing appointment cancelled.');
          fetchViewings(pagination.page);
        } catch (err) {
          toast.error(err.message || 'Cancel failed');
        }
      },
    });
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleModal.date) {
      toast.error('Please select an appointment date');
      return;
    }

    try {
      await adminService.rescheduleViewing(rescheduleModal.viewingId, {
        date: rescheduleModal.date,
        time: rescheduleModal.time || '02:00 PM',
        notes: rescheduleModal.notes,
      });
      toast.success('Viewing appointment successfully rescheduled!');
      setRescheduleModal({ isOpen: false, viewingId: null, date: '', time: '', notes: '' });
      fetchViewings(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Reschedule failed');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-emerald-950 text-emerald-400 border-emerald-500/40';
      case 'Completed':
        return 'bg-cyan-950 text-cyan-400 border-cyan-500/40';
      case 'Cancelled':
        return 'bg-rose-950 text-rose-400 border-rose-500/40';
      case 'Rescheduled':
        return 'bg-amber-950 text-amber-400 border-amber-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const columns = [
    {
      header: 'Property Title',
      render: (v) => (
        <div className="space-y-0.5 max-w-xs">
          <Link
            to={v.property ? `/admin/properties/${v.property}` : '#'}
            className="text-xs font-bold text-white hover:text-teal-400 truncate block"
          >
            {v.propertyTitle || 'Luxury Residential Property'}
          </Link>
          <p className="text-[10px] text-slate-400 truncate">{v.notes || 'VIP private walkthrough'}</p>
        </div>
      ),
    },
    {
      header: 'Customer / Buyer',
      render: (v) => (
        <div className="space-y-0.5">
          <p className="font-bold text-white text-xs">{v.customerName || 'Sophia Laurent'}</p>
          <p className="text-[11px] text-slate-400">{v.customerEmail || '—'}</p>
        </div>
      ),
    },
    {
      header: 'Listing Agent',
      render: (v) => <span className="text-teal-400 text-xs font-semibold">{v.agentName || 'Assigned Agent'}</span>,
    },
    {
      header: 'Date & Time',
      render: (v) => (
        <div className="space-y-0.5 font-mono text-xs">
          <p className="text-white font-bold">{v.date || '2025-05-15'}</p>
          <p className="text-amber-400 text-[11px]">{v.time || '02:00 PM'}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (v) => (
        <select
          value={v.status || 'Scheduled'}
          onChange={(e) => handleStatusUpdate(v._id || v.id, e.target.value)}
          className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border focus:outline-none ${getStatusStyle(
            v.status || 'Scheduled'
          )}`}
        >
          {['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'].map((st) => (
            <option key={st} value={st} className="bg-slate-900 text-white">
              {st}
            </option>
          ))}
        </select>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (v) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveViewing(v)}
            aria-label="View Appointment"
          >
            <Eye className="w-4 h-4 text-teal-400" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setRescheduleModal({
                isOpen: true,
                viewingId: v._id || v.id,
                date: v.date || '',
                time: v.time || '03:00 PM',
                notes: v.notes || '',
              })
            }
            aria-label="Reschedule Appointment"
          >
            <Clock className="w-4 h-4 text-amber-400" />
          </Button>

          {v.status !== 'Cancelled' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCancelViewing(v)}
              aria-label="Cancel Viewing"
            >
              <XCircle className="w-4 h-4 text-rose-400" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Property Viewing Requests & Calendar"
      subtitle="Oversee scheduled VIP property walkthroughs, track agent showing performance, and reschedule appointments."
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchViewings(pagination.page)}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Schedule
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdminStatCard
            title="Total Booked Viewings"
            value={pagination.total || viewings.length}
            subtitle="Client walkthrough appointments"
            icon={<Calendar className="w-6 h-6" />}
            color="teal"
          />
          <AdminStatCard
            title="Scheduled & Upcoming"
            value={viewings.filter((v) => v.status === 'Scheduled').length}
            subtitle="Confirmed calendar bookings"
            icon={<CheckCircle2 className="w-6 h-6" />}
            color="cyan"
          />
          <AdminStatCard
            title="Completed Tours"
            value={viewings.filter((v) => v.status === 'Completed').length}
            subtitle="Conducted by verified agents"
            icon={<Clock className="w-6 h-6" />}
            color="amber"
          />
        </div>

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search viewing by customer, agent, property title, or notes..."
          filters={[
            {
              label: 'Appointment Status',
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: 'all', label: 'All Viewings' },
                { value: 'Scheduled', label: 'Scheduled' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Cancelled', label: 'Cancelled' },
                { value: 'Rescheduled', label: 'Rescheduled' },
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
          data={viewings}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={fetchViewings}
          emptyMessage="No viewing appointments found matching your filters."
        />
      </div>

      {/* Reschedule Modal */}
      <Modal
        isOpen={rescheduleModal.isOpen}
        onClose={() => setRescheduleModal({ isOpen: false, viewingId: null, date: '', time: '', notes: '' })}
        title="Reschedule Viewing Appointment"
        description="Select a new confirmed calendar date and showing time."
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setRescheduleModal({ isOpen: false, viewingId: null, date: '', time: '', notes: '' })}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleRescheduleSubmit}>
              Confirm Reschedule
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="New Showing Date"
            type="date"
            value={rescheduleModal.date}
            onChange={(e) => setRescheduleModal((prev) => ({ ...prev, date: e.target.value }))}
            required
          />

          <Input
            label="Showing Time (e.g. 03:30 PM)"
            type="text"
            placeholder="03:30 PM"
            value={rescheduleModal.time}
            onChange={(e) => setRescheduleModal((prev) => ({ ...prev, time: e.target.value }))}
          />

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Rescheduling Reason / Gate Notes:</label>
            <textarea
              rows={3}
              value={rescheduleModal.notes}
              onChange={(e) => setRescheduleModal((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="e.g. Rescheduled per client flight itinerary change..."
              className="w-full bg-slate-950 text-white rounded-xl border border-slate-700 p-3 text-xs focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>
      </Modal>

      {/* Viewing Details Inspector Modal */}
      {activeViewing && (
        <Modal
          isOpen={Boolean(activeViewing)}
          onClose={() => setActiveViewing(null)}
          title={`Viewing for ${activeViewing.customerName}`}
          description={`Property: ${activeViewing.propertyTitle}`}
          footer={
            <Button variant="primary" size="sm" onClick={() => setActiveViewing(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Customer Contact:</span>
                <p className="text-white font-bold">{activeViewing.customerName}</p>
                <p className="text-slate-400">{activeViewing.customerEmail}</p>
                <p className="text-slate-400 font-mono">{activeViewing.customerPhone || '—'}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Assigned Agent:</span>
                <p className="text-teal-400 font-bold">{activeViewing.agentName}</p>
                <p className="text-slate-400">{activeViewing.agentEmail}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Showing Schedule & Special Instructions</span>
              <p className="text-white font-mono text-sm">{activeViewing.date} at {activeViewing.time}</p>
              <p className="text-slate-300 mt-1">{activeViewing.notes || 'No special instructions.'}</p>
            </div>
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
