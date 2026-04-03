import { useState } from 'react'
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react'
import { CATEGORIES, PRIORITIES, STATUSES } from '../hooks/useMapFilters'

const PRIORITY_LABELS = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

const PRIORITY_COLORS = {
  critical: 'text-red-600 bg-red-50 border-red-200',
  high: 'text-orange-600 bg-orange-50 border-orange-200',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  low: 'text-slate-500 bg-slate-50 border-slate-200',
}

const STATUS_LABELS = {
  pending: 'Pending',
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
}

function FilterSelect({ label, value, options, onChange, renderOption }) {
  const [open, setOpen] = useState(false)
  const isActive = value !== 'all'

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-2
          rounded-xl border transition-all duration-150 whitespace-nowrap
          ${
            isActive
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
      >
        {isActive ? (renderOption ? renderOption(value) : value) : label}
        <ChevronDown
          size={12}
          className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-999" onClick={() => setOpen(false)} />
          {/* Dropdown */}
          <div
            className="absolute top-full mt-1.5 left-0 z-1000 bg-white rounded-xl
            border border-slate-200 shadow-lg py-1 min-w-40"
          >
            <button
              onClick={() => {
                onChange('all')
                setOpen(false)
              }}
              className={`w-full text-left text-xs px-3 py-2 hover:bg-slate-50
                transition-colors font-medium
                ${value === 'all' ? 'text-blue-600' : 'text-slate-500'}`}
            >
              All {label}s
            </button>
            <div className="h-px bg-slate-100 my-1" />
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt)
                  setOpen(false)
                }}
                className={`w-full text-left text-xs px-3 py-2 hover:bg-slate-50
                  transition-colors font-semibold
                  ${value === opt ? 'text-blue-600' : 'text-slate-700'}`}
              >
                {renderOption ? renderOption(opt) : opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/**
 * MapFilters
 * @param {object}   filters     - { category, priority, status }
 * @param {function} setCategory
 * @param {function} setPriority
 * @param {function} setStatus
 * @param {function} reset       - clears all filters
 * @param {number}   activeCount - number of active filters
 * @param {number}   total       - total issues before filtering
 * @param {number}   showing     - issues after filtering
 */
export default function MapFilters({
  filters,
  setCategory,
  setPriority,
  setStatus,
  reset,
  activeCount,
  total,
  showing,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Filter icon + label */}
      <div
        className="inline-flex items-center gap-1.5 text-xs font-bold
        uppercase tracking-wider text-slate-400"
      >
        <SlidersHorizontal size={12} />
        Filter
      </div>

      {/* Category */}
      <FilterSelect
        label="Category"
        value={filters.category}
        options={CATEGORIES}
        onChange={setCategory}
      />

      {/* Priority */}
      <FilterSelect
        label="Priority"
        value={filters.priority}
        options={PRIORITIES}
        onChange={setPriority}
        renderOption={(val) => (
          <span
            className={`inline-flex items-center gap-1.5 font-semibold
            text-xs px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[val]}`}
          >
            {PRIORITY_LABELS[val]}
          </span>
        )}
      />

      {/* Status */}
      <FilterSelect
        label="Status"
        value={filters.status}
        options={STATUSES}
        onChange={setStatus}
        renderOption={(val) => STATUS_LABELS[val]}
      />

      {/* Clear button — only shown when filters are active */}
      {activeCount > 0 && (
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 text-xs font-semibold
            text-red-500 hover:text-red-700 px-2 py-1.5 rounded-lg
            hover:bg-red-50 transition-colors border border-red-200"
        >
          <X size={11} strokeWidth={2.5} />
          Clear {activeCount > 1 ? `(${activeCount})` : ''}
        </button>
      )}

      {/* Result count */}
      {activeCount > 0 && (
        <span className="text-xs text-slate-400 font-medium ml-1">
          {showing} of {total} shown
        </span>
      )}
    </div>
  )
}
