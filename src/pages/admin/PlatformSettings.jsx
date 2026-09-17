import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Building,
  Users,
  Bell,
  Lock,
  Save,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Mail,
  Phone,
  FileCheck,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { useToast } from '../../context/ToastContext';

export const PlatformSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Security password fields
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [confirmData, setConfirmData] = useState({ isOpen: false, title: '', message: '', action: null });
  const toast = useToast();

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getSettings();
      setSettings(res.data);
    } catch (err) {
      toast.error(err.message || 'Unable to retrieve platform settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSection = async (sectionName) => {
    try {
      setIsSaving(true);
      await adminService.updateSettings(sectionName, settings[sectionName]);
      toast.success(`Platform ${sectionName.toUpperCase()} settings saved successfully!`);
    } catch (err) {
      toast.error(err.message || 'Saving failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!passwordState.newPassword || passwordState.newPassword !== passwordState.confirmPassword) {
      toast.error('New passwords do not match or cannot be empty.');
      return;
    }

    setConfirmData({
      isOpen: true,
      title: 'Update Master Admin Password',
      message: 'Are you sure you want to change the primary administrator credentials?',
      variant: 'primary',
      action: async () => {
        try {
          toast.success('Master administrator password updated securely.');
          setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
          toast.error(err.message || 'Password update failed');
        }
      },
    });
  };

  if (isLoading || !settings) {
    return (
      <AdminLayout title="Platform Configuration & Settings">
        <LoadingSpinner fullPage text="Retrieving platform governance, moderation, and security parameters..." />
      </AdminLayout>
    );
  }

  const tabs = [
    { id: 'general', label: 'General Identity', icon: <Sliders className="w-4 h-4" /> },
    { id: 'properties', label: 'Property & Moderation', icon: <Building className="w-4 h-4" /> },
    { id: 'users', label: 'User & Registration', icon: <Users className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications & Broadcasts', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Sessions', icon: <Lock className="w-4 h-4" /> },
  ];

  return (
    <AdminLayout
      title="Platform Governance & System Settings"
      subtitle="Configure brand identity, automated property compliance, identity verification strictness, and security sessions."
      actions={
        <Button variant="outline" size="sm" onClick={fetchSettings} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Reload Settings
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Settings Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* 1. GENERAL SETTINGS */}
        {activeTab === 'general' && (
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">General Platform Identity</h3>
                <p className="text-xs text-slate-400">Configure marketplace public branding, support desk email, and phone contact.</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSaveSection('general')}
                isLoading={isSaving}
                leftIcon={<Save className="w-3.5 h-3.5" />}
              >
                Save General Settings
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Marketplace Platform Name"
                value={settings.general.platformName}
                onChange={(e) =>
                  setSettings({ ...settings, general: { ...settings.general, platformName: e.target.value } })
                }
              />
              <Input
                label="Logo Asset URL"
                value={settings.general.logoUrl}
                onChange={(e) =>
                  setSettings({ ...settings, general: { ...settings.general, logoUrl: e.target.value } })
                }
              />
              <Input
                label="Compliance & Contact Email"
                type="email"
                value={settings.general.contactEmail}
                onChange={(e) =>
                  setSettings({ ...settings, general: { ...settings.general, contactEmail: e.target.value } })
                }
              />
              <Input
                label="Toll-Free Direct Phone"
                value={settings.general.contactPhone}
                onChange={(e) =>
                  setSettings({ ...settings, general: { ...settings.general, contactPhone: e.target.value } })
                }
              />
            </div>
          </div>
        )}

        {/* 2. PROPERTY & MODERATION SETTINGS */}
        {activeTab === 'properties' && (
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Property & Listing Moderation Rules</h3>
                <p className="text-xs text-slate-400">Configure automated rejection rules, required title deeds, and maximum image counts.</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSaveSection('properties')}
                isLoading={isSaving}
                leftIcon={<Save className="w-3.5 h-3.5" />}
              >
                Save Property Settings
              </Button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Max Images Allowed per Listing"
                  type="number"
                  value={settings.properties.maxImagesPerListing}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      properties: { ...settings.properties, maxImagesPerListing: parseInt(e.target.value, 10) || 20 },
                    })
                  }
                />
                <Input
                  label="Auto-Flag Threshold (Number of Reports)"
                  type="number"
                  value={settings.properties.autoModerateFlaggedThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      properties: { ...settings.properties, autoModerateFlaggedThreshold: parseInt(e.target.value, 10) || 3 },
                    })
                  }
                />
              </div>

              {/* Toggles */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Require Notarized Title Deed Before Approval</span>
                  <p className="text-slate-400 text-[11px]">Strictly mandate deed verification before properties can transition to 'approved'.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.properties.requireNotarizedDeed}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      properties: { ...settings.properties, requireNotarizedDeed: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-teal-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. USER & REGISTRATION SETTINGS */}
        {activeTab === 'users' && (
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">User Registration & Verification</h3>
                <p className="text-xs text-slate-400">Manage open registration, identity documentation requirements for agents, and default roles.</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSaveSection('users')}
                isLoading={isSaving}
                leftIcon={<Save className="w-3.5 h-3.5" />}
              >
                Save User Settings
              </Button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Allow Public Open Registration</span>
                  <p className="text-slate-400 text-[11px]">Allow buyers, renters, and owners to self-register on the marketplace.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.users.allowPublicRegistration}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      users: { ...settings.users, allowPublicRegistration: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-teal-500 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Require Identity License Upload for Agents & Brokerages</span>
                  <p className="text-slate-400 text-[11px]">Enforce government broker license upload before agent verification.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.users.requireIdentityDocumentsForAgents}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      users: { ...settings.users, requireIdentityDocumentsForAgents: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-teal-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. NOTIFICATION SETTINGS */}
        {activeTab === 'notifications' && (
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Notification Delivery Channels</h3>
                <p className="text-xs text-slate-400">Configure transactional email dispatches, push broadcasts, and admin alert webhooks.</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSaveSection('notifications')}
                isLoading={isSaving}
                leftIcon={<Save className="w-3.5 h-3.5" />}
              >
                Save Notification Settings
              </Button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Enable Platform Push Broadcasts</span>
                  <p className="text-slate-400 text-[11px]">Display realtime announcements on user and agent dashboards.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.enablePlatformBroadcasts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, enablePlatformBroadcasts: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-teal-500 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Send Transactional Email Receipts</span>
                  <p className="text-slate-400 text-[11px]">Email confirmations for viewing appointments, inquiry replies, and approval notices.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.enableEmailAlerts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, enableEmailAlerts: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-teal-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* 5. SECURITY & SESSION SETTINGS */}
        {activeTab === 'security' && (
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Security, Sessions & Master Authentication</h3>
                <p className="text-xs text-slate-400">Configure JWT token lifespans, session timeout durations, and update admin credentials.</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSaveSection('security')}
                isLoading={isSaving}
                leftIcon={<Save className="w-3.5 h-3.5" />}
              >
                Save Session Settings
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Admin Session Timeout (Minutes)"
                type="number"
                value={settings.security.sessionTimeoutMinutes}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    security: { ...settings.security, sessionTimeoutMinutes: parseInt(e.target.value, 10) || 60 },
                  })
                }
              />
              <Input
                label="JWT Expiration Duration (Days)"
                type="number"
                value={settings.security.jwtExpiryDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    security: { ...settings.security, jwtExpiryDays: parseInt(e.target.value, 10) || 7 },
                  })
                }
              />
            </div>

            {/* Password Update Form */}
            <form onSubmit={handlePasswordUpdate} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-400" />
                <span>Update Master Administrator Password</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Current Password"
                  type="password"
                  value={passwordState.currentPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                  required
                />
                <Input
                  label="New Admin Password"
                  type="password"
                  value={passwordState.newPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={passwordState.confirmPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" variant="danger" size="sm">
                  Change Admin Password
                </Button>
              </div>
            </form>
          </div>
        )}
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
