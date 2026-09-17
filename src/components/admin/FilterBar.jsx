import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

export const FilterBar = ({
  search = '',
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filters = [], // Array of { label, value, onChange, options: [{ value, label }] }
  onReset = null,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
      {/* Search Input */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-slate-950/80 text-white placeholder-slate-500 rounded-xl border border-slate-700/80 pl-10 pr-3.5 py-2 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20"
        />
      </div>

      {/* Filter Selects */}
      <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap justify-end">
        {filters.map((f, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            {f.label && <span className="text-[11px] font-semibold text-slate-400">{f.label}:</span>}
            <select
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              className="bg-slate-950 text-xs text-slate-200 rounded-xl border border-slate-700/80 px-3 py-2 focus:outline-none focus:border-teal-500"
            >
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
