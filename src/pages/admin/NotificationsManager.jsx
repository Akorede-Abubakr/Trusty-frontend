import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  Send,
  Users,
  Award,
  Briefcase,
  User,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Radio,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { FilterBar } from '../../components/admin/FilterBar';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { AdminStatCard, ConfirmModal } from '../../components/admin/ConfirmModal';
import { useToast } from '../../context/ToastContext';

export const NotificationsManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [audienceFilter, setAudienceFilter] = useState('all');

  // Announcement composer state
  const [composer, setComposer] = useState({
    title: '',
    message: '',
    targetAudience: 'all', // 'all', 'agents', 'agencies', 'user'
    type: 'announcement', // 'system', 'announcement', 'alert', 'compliance'
    priority: 'normal', // 'normal', 'high', 'urgent'
    recipientId: '',
    recipientName: '',
  });

  const [confirmData, setConfirmData] = useState({ isOpen: false, title: '', message: '', action: null });
  const toast = useToast();

  const fetchNotifications = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await adminService.getNotifications({
        page,
        limit: 10,
        targetAudience: audienceFilter,
      });
      setNotifications(res.data || []);
      if (res.meta) setPagination(res.meta);
    } catch (err) {
      toast.error(err.message || 'Unable to retrieve notifications');
    } finally {
      setIsLoading(false);
    }
  }, [audienceFilter, toast]);

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  const handleSendAnnouncement = async (e) => {
    e.preventDefault();
    if (!composer.title.trim() || !composer.message.trim()) {
      toast.error('Notification title and message are required.');
      return;
    }

    try {
      await adminService.sendAnnouncement(composer);
      toast.success(`Announcement dispatched to target audience: [${composer.targetAudience.toUpperCase()}]`);
      setComposer({
        title: '',
        message: '',
        targetAudience: 'all',
        type: 'announcement',
        priority: 'normal',
        recipientId: '',
        recipientName: '',
      });
      fetchNotifications(1);
    } catch (err) {
      toast.error(err.message || 'Dispatch failed');
    }
  };

  const handleMarkAsRead = async (notif) => {
    try {
      await adminService.markNotificationRead(notif._id || notif.id);
      toast.success('Notification marked as read');
      fetchNotifications(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  const getAudienceBadge = (aud) => {
    switch (aud) {
      case 'all':
        return 'bg-purple-950 text-purple-400 border-purple-500/40';
      case 'agents':
        return 'bg-emerald-950 text-emerald-400 border-emerald-500/40';
      case 'agencies':
        return 'bg-amber-950 text-amber-400 border-amber-500/40';
      case 'user':
        return 'bg-cyan-950 text-cyan-400 border-cyan-500/40';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  const columns = [
    {
      header: 'Title & Priority',
      render: (n) => (
        <div className="space-y-0.5 max-w-sm">
          <p className="font-bold text-white text-xs">{n.title}</p>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span
              className={`px-2 py-0.5 rounded font-bold uppercase ${
                n.priority === 'urgent'
                  ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                  : n.priority === 'high'
                  ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {n.priority}
            </span>
            <span className="text-slate-400 font-mono text-[11px]">{new Date(n.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Message Payload',
      render: (n) => (
        <p className="text-slate-300 text-xs max-w-sm truncate" title={n.message}>
          {n.message}
        </p>
      ),
    },
    {
      header: 'Target Audience',
      render: (n) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getAudienceBadge(n.targetAudience)}`}>
          {n.targetAudience}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (n) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            n.isRead ? 'bg-slate-800 text-slate-400' : 'bg-teal-950 text-teal-400 border border-teal-500/30'
          }`}
        >
          {n.isRead ? 'Read' : 'Active'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (n) => (
        <div className="flex items-center justify-end gap-1.5">
          {!n.isRead && (
            <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(n)} aria-label="Mark Read">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="System Notifications & Broadcast Dispatcher"
      subtitle="Broadcast compliance alerts, platform announcements, and targeted direct notifications to Users, Agents, or Agencies."
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchNotifications(pagination.page)}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Notifications
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdminStatCard
            title="Total Dispatched Alerts"
            value={pagination.total || notifications.length}
            subtitle="System & broadcast alerts"
            icon={<Bell className="w-6 h-6" />}
            color="teal"
          />
          <AdminStatCard
            title="Broadcasted Announcements"
            value={notifications.filter((n) => n.targetAudience === 'all').length}
            subtitle="Global platform messages"
            icon={<Radio className="w-6 h-6" />}
            color="purple"
          />
          <AdminStatCard
            title="Targeted Agent/Agency Notices"
            value={notifications.filter((n) => n.targetAudience === 'agents' || n.targetAudience === 'agencies').length}
            subtitle="Professional real estate network"
            icon={<Award className="w-6 h-6" />}
            color="amber"
          />
        </div>

        {/* 1. BROADCAST COMPOSER */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Send className="w-4 h-4 text-teal-400" />
              <span>Compose System Announcement or Direct Notification</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Real-time Push Dispatch</span>
          </div>

          <form onSubmit={handleSendAnnouncement} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Target Audience Selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Target Audience:</label>
                <select
                  value={composer.targetAudience}
                  onChange={(e) => setComposer((prev) => ({ ...prev, targetAudience: e.target.value }))}
                  className="w-full bg-slate-950 text-white rounded-xl border border-slate-700 px-3 py-2.5 text-xs focus:outline-none focus:border-teal-500"
                >
                  <option value="all">Broadcast to All Users</option>
                  <option value="agents">Licensed Agents Only</option>
                  <option value="agencies">Brokerage Agencies Only</option>
                  <option value="user">Specific User ID</option>
                </select>
              </div>

              {/* Notification Type */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Notification Type:</label>
                <select
                  value={composer.type}
                  onChange={(e) => setComposer((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-slate-950 text-white rounded-xl border border-slate-700 px-3 py-2.5 text-xs focus:outline-none focus:border-teal-500"
                >
                  <option value="announcement">Platform Announcement</option>
                  <option value="compliance">Compliance Directive</option>
                  <option value="system">System Maintenance</option>
                  <option value="alert">High-Priority Alert</option>
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Dispatch Priority:</label>
                <select
                  value={composer.priority}
                  onChange={(e) => setComposer((prev) => ({ ...prev, priority: e.target.value }))}
                  className="w-full bg-slate-950 text-white rounded-xl border border-slate-700 px-3 py-2.5 text-xs focus:outline-none focus:border-teal-500"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent Compliance</option>
                </select>
              </div>

              {/* Specific User Target if chosen */}
              {composer.targetAudience === 'user' && (
                <Input
                  label="Target User ID / Email"
                  placeholder="e.g. usr_buyer_1"
                  value={composer.recipientId}
                  onChange={(e) => setComposer((prev) => ({ ...prev, recipientId: e.target.value }))}
                  required
                />
              )}
            </div>

            <Input
              label="Notification Headline / Subject"
              placeholder="e.g. Mandatory MLS Compliance & Title Verification Protocol..."
              value={composer.title}
              onChange={(e) => setComposer((prev) => ({ ...prev, title: e.target.value }))}
              required
            />

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Announcement Content & Details:</label>
              <textarea
                rows={3}
                placeholder="Write the full broadcast text dispatched to user dashboards and push notification streams..."
                value={composer.message}
                onChange={(e) => setComposer((prev) => ({ ...prev, message: e.target.value }))}
                required
                className="w-full bg-slate-950 text-white rounded-xl border border-slate-700 p-3 text-xs focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>
                Dispatch Notification
              </Button>
            </div>
          </form>
        </div>

        {/* 2. NOTIFICATIONS STREAM TABLE */}
        <FilterBar
          search=""
          onSearchChange={() => {}}
          searchPlaceholder="Filter notifications by audience stream..."
          filters={[
            {
              label: 'Audience Stream',
              value: audienceFilter,
              onChange: setAudienceFilter,
              options: [
                { value: 'all', label: 'All Notifications' },
                { value: 'agents', label: 'Agents' },
                { value: 'agencies', label: 'Agencies' },
                { value: 'user', label: 'Direct Users' },
              ],
            },
          ]}
          onReset={() => setAudienceFilter('all')}
        />

        <DataTable
          columns={columns}
          data={notifications}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={fetchNotifications}
          emptyMessage="No notifications found in audit stream."
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
