import React from 'react';
import { Layers, Plus } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon,
  title = 'No Records Found',
  description = 'There are no active items available in this view yet.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-10 rounded-2xl bg-slate-900/60 border border-slate-800 text-center max-w-lg mx-auto my-6 ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-teal-400 mb-4 shadow-inner">
        {icon || <Layers className="w-8 h-8 opacity-80" />}
      </div>
      <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="sm"
          onClick={onAction}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
