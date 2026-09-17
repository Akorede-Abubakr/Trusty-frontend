import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  MapPin,
  DollarSign,
  User,
  Award,
  Briefcase,
  CheckCircle,
  XCircle,
  Ban,
  Trash2,
  AlertTriangle,
  Bed,
  Bath,
  Maximize,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ReasonModal } from '../../components/admin/ReasonModal';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { useToast } from '../../context/ToastContext';

export const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({ isOpen: false, title: '', message: '', action: null });

  const toast = useToast();
  const navigate = useNavigate();

  const fetchProperty = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getPropertyById(id);
      setProperty(res.data);
    } catch (err) {
      toast.error(err.message || 'Unable to retrieve property moderation record');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const handleApprove = async () => {
    try {
      await adminService.updatePropertyVerification(id, { verificationStatus: 'approved' });
      toast.success('Property has been approved and published to verified live MLS.');
      fetchProperty();
    } catch (err) {
      toast.error(err.message || 'Approval failed');
    }
  };

  const handleReject = async (reason) => {
    try {
      await adminService.updatePropertyVerification(id, {
        verificationStatus: 'rejected',
        rejectionReason: reason,
      });
      toast.warning('Property has been rejected with compliance notes.');
      fetchProperty();
    } catch (err) {
      toast.error(err.message || 'Rejection failed');
    }
  };

  const handleStatusToggle = () => {
    const newStatus = property.status === 'available' ? 'suspended' : 'available';
    setConfirmData({
      isOpen: true,
      title: `${newStatus === 'suspended' ? 'Suspend' : 'Reactivate'} Listing`,
      message: `Set marketplace status to '${newStatus}' for this property?`,
      variant: newStatus === 'suspended' ? 'danger' : 'primary',
      action: async () => {
        try {
          await adminService.updatePropertyStatus(id, newStatus);
          toast.success(`Property status set to ${newStatus}`);
          fetchProperty();
        } catch (err) {
          toast.error(err.message || 'Status update failed');
        }
      },
    });
  };

  const handleDelete = () => {
    setConfirmData({
      isOpen: true,
      title: 'Delete Property Record',
      message: 'Are you sure you want to permanently delete this property listing? This cannot be undone.',
      variant: 'danger',
      action: async () => {
        try {
          await adminService.deleteProperty(id);
          toast.success('Property removed from marketplace.');
          navigate('/admin/properties');
        } catch (err) {
          toast.error(err.message || 'Delete failed');
        }
      },
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Property Moderation">
        <LoadingSpinner fullPage text="Retrieving property moderation inspection data..." />
      </AdminLayout>
    );
  }

  if (!property) {
    return (
      <AdminLayout title="Property Not Found">
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <p className="text-sm text-slate-400">Property identifier could not be located in registry.</p>
          <Link to="/admin/properties">
            <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return to Properties
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const { ownerDetails, agentDetails, agencyDetails, images = [], reports = [] } = property;

  return (
    <AdminLayout
      title="Property Moderation Inspection"
      subtitle={`Auditing Title & Media for ID: ${property._id || property.id}`}
      actions={
        <div className="flex items-center gap-2">
          <Link to="/admin/properties">
            <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Inventory
            </Button>
          </Link>
          {property.verificationStatus !== 'approved' && (
            <Button variant="primary" size="sm" onClick={handleApprove} leftIcon={<CheckCircle className="w-4 h-4" />}>
              Approve Listing
            </Button>
          )}
          {property.verificationStatus !== 'rejected' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRejectModalOpen(true)}
              leftIcon={<XCircle className="w-4 h-4 text-amber-400" />}
            >
              Reject (With Reason)
            </Button>
          )}
          <Button
            variant={property.status === 'available' ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleStatusToggle}
            leftIcon={<Ban className="w-3.5 h-3.5" />}
          >
            {property.status === 'available' ? 'Suspend' : 'Activate'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 text-rose-400" />
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 1. MEDIA INSPECTION GALLERY */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-teal-400" />
              <span>Architectural Photography & Media Inspection</span>
            </h3>
            <span className="text-xs text-slate-400">
              Image {activeImageIndex + 1} of {images.length || 1}
            </span>
          </div>

          <div className="relative h-96 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            <img
              src={
                images[activeImageIndex]?.url ||
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
              }
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {images[activeImageIndex]?.caption && (
              <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold text-white border border-slate-700">
                {images[activeImageIndex].caption}
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImageIndex(i)}
                className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                  activeImageIndex === i ? 'border-teal-400 scale-105 shadow-lg' : 'border-slate-800 opacity-60'
                }`}
              >
                <img src={img.url} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* 2. CORE PROPERTY DETAILS & VALUATION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold font-serif text-white">{property.title}</h2>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>
                    {property.location?.address}, {property.location?.city}, {property.location?.state}{' '}
                    {property.location?.zipCode}
                  </span>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-2xl font-bold font-serif text-teal-400">
                  ${property.price?.toLocaleString()}
                </span>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                  {property.listingType} • {property.propertyType}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Full Description & Inclusions
              </span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                {property.description}
              </p>
            </div>

            {/* Features spec */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <Bed className="w-4 h-4 text-teal-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-white">{property.features?.bedrooms || 0} Beds</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <Bath className="w-4 h-4 text-teal-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-white">{property.features?.bathrooms || 0} Baths</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <Maximize className="w-4 h-4 text-teal-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-white">{property.features?.areaSqFt || 0} sq ft</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <Calendar className="w-4 h-4 text-teal-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-white">Built {property.features?.yearBuilt || 2022}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Moderation Flags & Attribution Cards */}
          <div className="lg:col-span-4 space-y-6">
            {/* Status & Compliance Matrix */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3.5 text-xs">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                Moderation Status
              </h4>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Verification</span>
                <Badge variant={property.verificationStatus}>{property.verificationStatus}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Marketplace Status</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    property.status === 'available'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                  }`}
                >
                  {property.status}
                </span>
              </div>

              {property.rejectionReason && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-[11px] space-y-1">
                  <span className="font-bold block">Recorded Rejection Reason:</span>
                  <p>{property.rejectionReason}</p>
                </div>
              )}
            </div>

            {/* Stakeholder Cards: Owner, Agent, Agency */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 text-xs">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                Stakeholders & Attribution
              </h4>

              {/* Owner */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    <span>Property Owner</span>
                  </span>
                  {ownerDetails && (
                    <Link to={`/admin/users/${ownerDetails._id || ownerDetails.id}`} className="text-teal-400 hover:underline">
                      View
                    </Link>
                  )}
                </div>
                <p className="font-bold text-white">{ownerDetails ? `${ownerDetails.firstName} ${ownerDetails.lastName}` : 'Direct Investor'}</p>
                <p className="text-[11px] text-slate-400">{ownerDetails?.email || '—'}</p>
              </div>

              {/* Agent */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Listing Agent</span>
                  </span>
                  {agentDetails && (
                    <Link to={`/admin/agents/${agentDetails._id || agentDetails.id}`} className="text-teal-400 hover:underline">
                      View
                    </Link>
                  )}
                </div>
                <p className="font-bold text-white">{agentDetails ? `${agentDetails.firstName} ${agentDetails.lastName}` : 'Unassigned'}</p>
                <p className="text-[11px] text-slate-400">{agentDetails?.email || '—'}</p>
              </div>

              {/* Agency */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                    <span>Brokerage Firm</span>
                  </span>
                  {agencyDetails && (
                    <Link to={`/admin/agencies/${agencyDetails._id || agencyDetails.id}`} className="text-teal-400 hover:underline">
                      View
                    </Link>
                  )}
                </div>
                <p className="font-bold text-white">{agencyDetails ? `${agencyDetails.firstName} ${agencyDetails.lastName}` : 'Independent Brokerage'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. USER REPORTS & AUDIT SECTION */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Flagged User Reports & Compliance Inquiries ({reports.length})</span>
            </h3>
          </div>

          {reports.length === 0 ? (
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
              No active complaints or compliance flags filed against this property.
            </div>
          ) : (
            <div className="space-y-2.5">
              {reports.map((rep, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-400">{rep.reportedBy} ({rep.reporterEmail || 'User'})</span>
                    <span className="text-slate-400 text-[11px]">{new Date(rep.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-200">{rep.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ReasonModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onSubmit={handleReject}
        title={`Reject Property: ${property.title}`}
      />

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
