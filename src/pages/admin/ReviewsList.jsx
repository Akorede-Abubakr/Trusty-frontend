import React, { useState, useEffect, useCallback } from 'react';
import { Star, Eye, EyeOff, Trash2, RefreshCw, MessageSquare, ShieldCheck, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { FilterBar } from '../../components/admin/FilterBar';
import { ConfirmModal, AdminStatCard } from '../../components/admin/ConfirmModal';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

export const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [hiddenFilter, setHiddenFilter] = useState('all');

  const [activeReview, setActiveReview] = useState(null);
  const [confirmData, setConfirmData] = useState({ isOpen: false, title: '', message: '', action: null });

  const toast = useToast();

  const fetchReviews = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await adminService.getReviews({
        page,
        limit: 10,
        search,
        rating: ratingFilter,
        isHidden: hiddenFilter,
      });
      setReviews(res.data || []);
      if (res.meta) setPagination(res.meta);
    } catch (err) {
      toast.error(err.message || 'Unable to retrieve client reviews');
    } finally {
      setIsLoading(false);
    }
  }, [search, ratingFilter, hiddenFilter, toast]);

  useEffect(() => {
    fetchReviews(1);
  }, [fetchReviews]);

  const handleToggleVisibility = async (review) => {
    const newHiddenState = !review.isHidden;
    try {
      await adminService.updateReviewVisibility(review._id || review.id, newHiddenState);
      toast.success(`Review visibility set to ${newHiddenState ? 'Hidden' : 'Visible'}`);
      fetchReviews(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  const handleDelete = (review) => {
    setConfirmData({
      isOpen: true,
      title: 'Delete Review Record',
      message: `Permanently remove review from "${review.authorName}"? This action cannot be undone.`,
      variant: 'danger',
      action: async () => {
        try {
          await adminService.deleteReview(review._id || review.id);
          toast.success('Review permanently deleted.');
          fetchReviews(pagination.page);
          setActiveReview(null);
        } catch (err) {
          toast.error(err.message || 'Delete failed');
        }
      },
    });
  };

  const columns = [
    {
      header: 'Author / Client',
      render: (r) => (
        <div className="space-y-0.5">
          <p className="font-bold text-white text-xs">{r.authorName}</p>
          <p className="text-[11px] text-slate-400">{r.authorEmail || 'Verified Client'}</p>
        </div>
      ),
    },
    {
      header: 'Target Agent / Agency',
      render: (r) => <span className="font-semibold text-teal-400 text-xs">{r.targetName}</span>,
    },
    {
      header: 'Star Rating',
      render: (r) => (
        <div className="flex items-center gap-1 text-amber-400">
          {[...Array(r.rating || 5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-current" />
          ))}
          <span className="text-[11px] text-slate-300 font-bold ml-1">({r.rating}.0)</span>
        </div>
      ),
    },
    {
      header: 'Review Comment',
      render: (r) => (
        <p className="text-slate-300 text-xs max-w-sm truncate" title={r.comment}>
          "{r.comment}"
        </p>
      ),
    },
    {
      header: 'Visibility Status',
      render: (r) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
            r.isHidden
              ? 'bg-rose-950 text-rose-400 border border-rose-500/40'
              : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
          }`}
        >
          {r.isHidden ? 'Hidden' : 'Public'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveReview(r)}
            aria-label="View Full Review"
          >
            <Eye className="w-4 h-4 text-teal-400" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleVisibility(r)}
            aria-label={r.isHidden ? 'Restore Review' : 'Hide Review'}
          >
            {r.isHidden ? (
              <EyeOff className="w-4 h-4 text-amber-400" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(r)}
            aria-label="Delete Review"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Client Reviews & Ratings Moderation"
      subtitle="Search reviews, filter ratings from 1 to 5 stars, hide defamatory comments, restore verified feedback, and delete records."
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchReviews(pagination.page)}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Reviews
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdminStatCard
            title="Total Client Reviews"
            value={pagination.total || reviews.length}
            subtitle="Verified transaction feedback"
            icon={<Star className="w-6 h-6" />}
            color="amber"
          />
          <AdminStatCard
            title="Public Verified Reviews"
            value={reviews.filter((r) => !r.isHidden).length}
            subtitle="Active on agent profiles"
            icon={<ShieldCheck className="w-6 h-6" />}
            color="teal"
          />
          <AdminStatCard
            title="Hidden / Flagged Reviews"
            value={reviews.filter((r) => r.isHidden).length}
            subtitle="Suppressed from public view"
            icon={<EyeOff className="w-6 h-6" />}
            color="rose"
          />
        </div>

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search review comment, client author, or target agent..."
          filters={[
            {
              label: 'Star Rating',
              value: ratingFilter,
              onChange: setRatingFilter,
              options: [
                { value: 'all', label: 'All Ratings' },
                { value: '5', label: '5 Stars ★★★★★' },
                { value: '4', label: '4 Stars ★★★★' },
                { value: '3', label: '3 Stars ★★★' },
                { value: '2', label: '2 Stars ★★' },
                { value: '1', label: '1 Star ★' },
              ],
            },
            {
              label: 'Visibility',
              value: hiddenFilter,
              onChange: setHiddenFilter,
              options: [
                { value: 'all', label: 'All Visibilities' },
                { value: 'false', label: 'Visible' },
                { value: 'true', label: 'Hidden' },
              ],
            },
          ]}
          onReset={() => {
            setSearch('');
            setRatingFilter('all');
            setHiddenFilter('all');
          }}
        />

        <DataTable
          columns={columns}
          data={reviews}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={fetchReviews}
          emptyMessage="No reviews found matching your filter parameters."
        />
      </div>

      {/* Review Inspector Modal */}
      {activeReview && (
        <Modal
          isOpen={Boolean(activeReview)}
          onClose={() => setActiveReview(null)}
          title={`Review by ${activeReview.authorName}`}
          description={`Target: ${activeReview.targetName}`}
          footer={
            <div className="flex items-center gap-2">
              <Button
                variant={activeReview.isHidden ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => {
                  handleToggleVisibility(activeReview);
                  setActiveReview(null);
                }}
              >
                {activeReview.isHidden ? 'Restore Review to Public' : 'Hide Review'}
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(activeReview)}>
                Delete Review
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(activeReview.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-slate-400 font-mono">
                {new Date(activeReview.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Client Feedback Text</span>
              <p className="text-slate-200 text-sm leading-relaxed">"{activeReview.comment}"</p>
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
