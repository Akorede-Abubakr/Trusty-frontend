import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Operation',
  message = 'Are you certain you wish to proceed with this administrative change?',
  confirmLabel = 'Confirm',
  variant = 'danger', // 'danger', 'primary', 'gold'
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={variant}
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 flex-shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs text-slate-300 leading-relaxed">{message}</p>
          <p className="text-[11px] text-slate-500">
            This action will be logged in the administrative audit trail.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export const AdminStatCard = ({ title, value, subtitle, icon, color = 'teal', className = '' }) => {
  const colors = {
    teal: 'border-teal-500/30 bg-teal-950/20 text-teal-400',
    amber: 'border-amber-500/30 bg-amber-950/20 text-amber-400',
    cyan: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-400',
    rose: 'border-rose-500/30 bg-rose-950/20 text-rose-400',
  };

  return (
    <div
      className={`p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between shadow-lg ${className}`}
    >
      <div className="space-y-1">
        <span className="text-xs font-semibold text-slate-400">{title}</span>
        <h3 className="text-2xl font-bold font-serif text-white">{value}</h3>
        {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
      </div>
      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${colors[color] || colors.teal}`}>
        {icon}
      </div>
    </div>
  );
};
