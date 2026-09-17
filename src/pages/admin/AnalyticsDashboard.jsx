import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Building,
  DollarSign,
  Award,
  Calendar,
  MessageSquare,
  Eye,
  Bookmark,
  CheckCircle,
  XCircle,
  MapPin,
  RefreshCw,
  PieChart as PieIcon,
  BarChart3,
  Star,
  ShieldCheck,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminStatCard } from '../../components/admin/ConfirmModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

export const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getAnalytics();
      setData(res.data);
    } catch (err) {
      toast.error(err.message || 'Unable to retrieve platform analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout title="Platform Analytics">
        <LoadingSpinner fullPage text="Aggregating marketplace intelligence, lead funnels, and valuation metrics..." />
      </AdminLayout>
    );
  }

  const { userAnalytics = {}, propertyAnalytics = {}, leadAnalytics = {}, agentAnalytics = {} } = data || {};
  const { usersByRole = {}, userGrowth = [] } = userAnalytics;
  const { propertiesByType = {}, propertiesByListingType = {}, propertiesByLocation = {}, mostViewedProperties = [], mostSavedProperties = [] } = propertyAnalytics;
  const { mostActiveAgents = [] } = agentAnalytics;

  return (
    <AdminLayout
      title="Platform Executive Analytics & Intelligence"
      subtitle="Real-time macro performance, portfolio distribution, lead conversion metrics, and agent ranking."
      actions={
        <Button variant="outline" size="sm" onClick={fetchAnalytics} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh Telemetry
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Top 4 Hero KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            title="Total Registered Users"
            value={userAnalytics.totalUsers || 0}
            subtitle={`${userAnalytics.activeUsers || 0} active users online`}
            icon={<Users className="w-6 h-6" />}
            color="teal"
          />
          <AdminStatCard
            title="Average Property Valuation"
            value={`$${(propertyAnalytics.avgPropertyPrice || 0).toLocaleString()}`}
            subtitle="Marketplace listing mean"
            icon={<DollarSign className="w-6 h-6" />}
            color="cyan"
          />
          <AdminStatCard
            title="Lead Conversion Rate"
            value={`${leadAnalytics.inquiryConversionRate || 0}%`}
            subtitle="Inquiry to signed tour/lease"
            icon={<TrendingUp className="w-6 h-6" />}
            color="amber"
          />
          <AdminStatCard
            title="Active Listings Inventory"
            value={propertyAnalytics.totalProperties || 0}
            subtitle={`${propertyAnalytics.newProperties || 0} available live`}
            icon={<Building className="w-6 h-6" />}
            color="purple"
          />
        </div>

        {/* 1. USER ANALYTICS & GROWTH TRAJECTORY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* User Growth Bar Chart */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-400" />
                <span>Monthly User Growth & Onboarding Momentum</span>
              </h3>
              <span className="text-xs font-mono text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/30">
                +148% QoQ
              </span>
            </div>

            {/* Custom SVG Growth Curve with Bar Grid */}
            <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
              {userGrowth.map((g, idx) => {
                const heightPercent = Math.min(Math.round((g.count / 140) * 100), 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-950 px-2 py-1 rounded text-[10px] font-mono text-teal-400 border border-slate-700 whitespace-nowrap z-20 pointer-events-none">
                      {g.count} Users ({g.month})
                    </div>
                    {/* Bar */}
                    <div className="w-full max-w-[42px] bg-slate-950 rounded-xl overflow-hidden p-0.5 border border-slate-800 h-36 flex items-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full rounded-lg bg-gradient-to-t from-teal-600 via-teal-400 to-amber-300 transition-all duration-700 group-hover:brightness-125"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 font-bold">{g.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Roles Breakdown */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <PieIcon className="w-4 h-4 text-amber-400" />
              <span>Users by Role Distribution</span>
            </h3>

            <div className="space-y-3 pt-1">
              {[
                { role: 'Buyers', count: usersByRole.buyer || 0, color: 'bg-teal-400', text: 'text-teal-400' },
                { role: 'Renters', count: usersByRole.renter || 0, color: 'bg-cyan-400', text: 'text-cyan-400' },
                { role: 'Property Owners', count: usersByRole.owner || 0, color: 'bg-purple-400', text: 'text-purple-400' },
                { role: 'Licensed Agents', count: usersByRole.agent || 0, color: 'bg-amber-400', text: 'text-amber-400' },
                { role: 'Brokerages / Agencies', count: usersByRole.agency || 0, color: 'bg-emerald-400', text: 'text-emerald-400' },
                { role: 'Platform Admins', count: usersByRole.admin || 0, color: 'bg-rose-400', text: 'text-rose-400' },
              ].map((item, i) => {
                const total = userAnalytics.totalUsers || 1;
                const pct = Math.round((item.count / total) * 100);
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{item.role}</span>
                      <span className={`font-mono font-bold ${item.text}`}>{item.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div style={{ width: `${pct}%` }} className={`h-full rounded-full ${item.color}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. PROPERTY ANALYTICS: CATEGORY, LISTING TYPE & REGION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Properties by Type */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Properties by Architectural Type
            </h3>
            <div className="space-y-2.5">
              {Object.entries(propertiesByType).map(([type, count], idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <span className="text-slate-300 capitalize font-medium">{type}</span>
                  <span className="font-bold text-teal-400 font-mono">{count} Units</span>
                </div>
              ))}
            </div>
          </div>

          {/* Properties by Listing Type */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Listing Transaction Models
            </h3>
            <div className="space-y-2.5">
              {Object.entries(propertiesByListingType).map(([type, count], idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <span className="text-slate-300 capitalize font-medium">{type} Transaction</span>
                  <span className="font-bold text-amber-400 font-mono">{count} Listings</span>
                </div>
              ))}
            </div>
          </div>

          {/* Properties by Location */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Geographic Region Concentration
            </h3>
            <div className="space-y-2.5">
              {Object.entries(propertiesByLocation).map(([city, count], idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <span className="text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    <span>{city}</span>
                  </span>
                  <span className="font-bold text-cyan-400 font-mono">{count} Assets</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. MOST VIEWED & MOST SAVED PROPERTIES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Viewed */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <Eye className="w-4 h-4 text-teal-400" />
              <span>Most Viewed Property Portfolios</span>
            </h3>

            <div className="space-y-3">
              {mostViewedProperties.map((p, i) => (
                <div key={p.id || i} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3.5">
                  <img
                    src={p.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
                    alt={p.title}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-xs font-bold text-white truncate">{p.title}</p>
                    <p className="text-[11px] text-teal-400 font-mono font-bold">${p.price?.toLocaleString()} • {p.city}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1 justify-end">
                      <Eye className="w-3 h-3" />
                      <span>{p.views?.toLocaleString()} views</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Saved */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Most Saved / Shortlisted Properties</span>
            </h3>

            <div className="space-y-3">
              {mostSavedProperties.map((p, i) => (
                <div key={p.id || i} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3.5">
                  <img
                    src={p.image || 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=200&q=80'}
                    alt={p.title}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-xs font-bold text-white truncate">{p.title}</p>
                    <p className="text-[11px] text-teal-400 font-mono font-bold">${p.price?.toLocaleString()} • {p.city}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1 justify-end">
                      <Bookmark className="w-3 h-3" />
                      <span>{p.savedCount?.toLocaleString()} saves</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. LEAD CONVERSION & AGENT PERFORMANCE LEADERBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lead Funnel */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Lead & Viewing Conversion Funnel</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-300">Total Customer Inquiries</span>
                <span className="font-bold text-white font-mono">{leadAnalytics.totalInquiries || 0}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-300">Viewing Walkthroughs Booked</span>
                <span className="font-bold text-amber-400 font-mono">{leadAnalytics.viewingRequests || 0}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-300">Completed VIP Tours</span>
                <span className="font-bold text-emerald-400 font-mono">{leadAnalytics.completedViewings || 0}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-300">Cancelled / Rescheduled</span>
                <span className="font-bold text-rose-400 font-mono">{leadAnalytics.cancelledViewings || 0}</span>
              </div>
            </div>
          </div>

          {/* Top Agent Leaderboard */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Top Licensed Agents Performance Matrix</span>
            </h3>

            <div className="space-y-3">
              {mostActiveAgents.map((ag) => (
                <div key={ag.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={ag.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'}
                      alt={ag.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-800"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{ag.name}</p>
                      <p className="text-[11px] text-slate-400">{ag.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <span className="text-teal-400 font-bold font-mono">{ag.listingsCount} Listings</span>
                      <p className="text-[10px] text-slate-400">{ag.inquiriesCount} Inquiries</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-500/30">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold text-xs">{ag.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
