import React, { useState } from 'react';
import { ShieldAlert, AlertCircle, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const ReasonModal = ({
  isOpen,
  onClose,
  onSubmit,
  title = 'Reason Required for Rejection',
  description = 'Specify why this property or entity is being rejected to inform compliance and the listing agent.',
  actionLabel = 'Confirm Rejection',
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const reasonPresets = [
    'Missing notarized deed or HOA verification stamp.',
    'Property price significantly deviates from certified comps.',
    'Misleading or unverified architectural photography.',
    'Zoning permits require municipal building approval.',
    'Owner identity KYC failed title chain match.',
  ];

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('A valid reason is required to reject this record.');
      return;
    }
    onSubmit(reason.trim());
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleSubmit}>
            {actionLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Preset quick chips */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Quick Select Standard Presets:</label>
          <div className="flex flex-wrap gap-1.5">
            {reasonPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setReason(preset);
                  if (error) setError('');
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 text-left transition-all"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Detailed Rejection Notes:</label>
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
            placeholder="Type comprehensive compliance notes or audit instructions here..."
            className="w-full bg-slate-950 text-white placeholder-slate-500 rounded-xl border border-slate-700/80 p-3 text-xs focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30"
          />
          {error && (
            <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};
