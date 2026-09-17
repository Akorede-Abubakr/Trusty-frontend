import React from 'react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const DataTable = ({
  columns = [],
  data = [],
  isLoading = false,
  pagination = null,
  onPageChange = null,
  emptyMessage = 'No records found matching your active criteria.',
  keyExtractor = (item) => item._id || item.id,
}) => {
  if (isLoading) {
    return (
      <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-800 p-12 flex justify-center">
        <LoadingSpinner size="md" text="Loading table data..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-800 p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-slate-800 text-teal-400 flex items-center justify-center mx-auto border border-slate-700">
          <Inbox className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white">No Records Found</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col">
      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th key={idx} className={`py-3.5 px-4 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-xs">
            {data.map((item, rowIdx) => {
              const rowKey = keyExtractor(item) || rowIdx;
              return (
                <tr
                  key={rowKey}
                  className="hover:bg-slate-800/50 transition-colors duration-150 group"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`py-3.5 px-4 text-slate-200 ${col.className || ''}`}>
                      {col.render ? col.render(item, rowIdx) : item[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="border-t border-slate-800 px-4 py-3 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Showing page <strong className="text-white">{pagination.page}</strong> of{' '}
            <strong className="text-white">{pagination.totalPages || 1}</strong> (Total:{' '}
            <strong className="text-teal-400">{pagination.total || data.length}</strong> records)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange && onPageChange(pagination.page - 1)}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: pagination.totalPages || 1 }, (_, i) => i + 1)
              .slice(Math.max(0, pagination.page - 3), pagination.page + 2)
              .map((pNum) => (
                <button
                  key={pNum}
                  type="button"
                  onClick={() => onPageChange && onPageChange(pNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                    pagination.page === pNum
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {pNum}
                </button>
              ))}

            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange && onPageChange(pagination.page + 1)}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
