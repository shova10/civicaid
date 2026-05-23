import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Search,
  ArrowLeft,
  X,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  ThumbsUp,
  MapPin,
  Calendar,
} from 'lucide-react'
import toast from 'react-hot-toast'
import StatusBadge from '../../components/StatusBadge'
import PriorityBadge from '../../components/PriorityBadge'
import useIssueTable from '../../hooks/useIssueTable'
import { getAdminIssues } from '../../services/issues'
// ─── Constants ────────────────────────────────────────────────────────────────
const STATUSES = ['reported', 'in_progress', 'resolved', 'closed', 'rejected']
const PRIORITIES = ['critical', 'high', 'medium', 'low']
const CATEGORIES = [
  'Road & Transport',
  'Water & Drainage',
  'Electricity',
  'Waste Management',
  'Public Safety',
  'Parks & Green',
  'Other',
]
const STATUS_LABELS = {
  reported: 'Reported',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
  rejected: 'Rejected',
}

const PRIORITY_LABELS = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Sort icon ────────────────────────────────────────────────────────────────
function SortIcon({ col, sortKey, sortDir }) {
  if (sortKey !== col)
    return <ChevronsUpDown size={12} className="text-slate-300" />
  return sortDir === 'asc' ? (
    <ChevronUp size={12} className="text-blue-500" />
  ) : (
    <ChevronDown size={12} className="text-blue-500" />
  )
}

// ─── Filter select ────────────────────────────────────────────────────────────
function FilterSelect({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`text-xs font-medium border rounded-xl px-3 py-2 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors
        ${
          value !== 'all'
            ? 'bg-slate-900 text-white border-slate-900'
            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
        }`}
    >
      <option value="all">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 bg-slate-100 rounded-full w-full" />
        </td>
      ))}
    </tr>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({
  page,
  totalPages,
  totalFiltered,
  pageSize,
  setPage,
  setPageSize,
  pageSizeOptions,
}) {
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalFiltered)

  // Build page number array with ellipsis
  function getPages() {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page <= 4) return [1, 2, 3, 4, 5, '...', totalPages]
    if (page >= totalPages - 3)
      return [
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ]
    return [1, '...', page - 1, page, page + 1, '...', totalPages]
  }

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between gap-3
      px-4 py-3 border-t border-slate-100 bg-slate-50/50"
    >
      {/* Left: count */}
      <p className="text-xs text-slate-400 font-medium">
        {totalFiltered === 0
          ? 'No results'
          : `${start}–${end} of ${totalFiltered}`}
      </p>

      {/* Center: page buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200
            disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
        </button>

        {getPages().map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-xs text-slate-300">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors
                ${
                  page === p
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:bg-slate-200 hover:text-slate-800'
                }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200
            disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Right: page size */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Rows</span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
            setPage(1)
          }}
          className="text-xs font-medium text-slate-600 bg-white border border-slate-200
            rounded-lg px-2 py-1 cursor-pointer focus:outline-none"
        >
          {pageSizeOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminIssues() {
  const navigate = useNavigate()
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [searchParams] = useSearchParams()
  const cameFromDashboard = searchParams.toString() !== ''

  const {
    search,
    setSearch,
    status,
    setStatus,
    priority,
    setPriority,
    category,
    setCategory,
    setDuplicate,
    activeFilters,
    resetFilters,
    sortKey,
    sortDir,
    handleSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    pageSizeOptions,
    totalPages,
    totalFiltered,
    rows,
  } = useIssueTable(issues)

  async function fetchIssues() {
    setLoading(true)
    setError(false)
    try {
      const data = await getAdminIssues()
      setIssues(Array.isArray(data) ? data : (data.results ?? []))
    } catch (err) {
      setError(true)
      toast.error(err?.response?.data?.message ?? 'Could not load issues.')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    const statusParam = searchParams.get('status')
    const categoryParam = searchParams.get('category')
    const duplicateParam = searchParams.get('duplicate')

    if (statusParam) setStatus(statusParam)
    if (categoryParam) setCategory(categoryParam)
    if (duplicateParam === 'true') setDuplicate(true)
  }, [searchParams, setCategory, setStatus, setDuplicate])

  useEffect(() => {
    fetchIssues()
  }, [])

  // Column header button
  function Th({ col, label, className = '' }) {
    return (
      <th
        onClick={() => handleSort(col)}
        className={`px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider
          text-slate-400 cursor-pointer hover:text-slate-600 select-none
          whitespace-nowrap group ${className}`}
      >
        <div className="flex items-center gap-1.5">
          {label}
          <SortIcon col={col} sortKey={sortKey} sortDir={sortDir} />
        </div>
      </th>
    )
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {cameFromDashboard && (
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400
          hover:text-slate-700 font-medium mb-2 group transition-colors"
            >
              <ArrowLeft
                size={13}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
              Back to Dashboard
            </button>
          )}
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Issues
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {loading ? 'Loading…' : `${issues.length} total issues`}
          </p>
        </div>
        <button
          onClick={fetchIssues}
          disabled={loading}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500
            hover:text-slate-800 px-3 py-2 rounded-xl border border-slate-200
            hover:bg-slate-50 transition-all disabled:opacity-40"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* ── Filters bar ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Search */}
        <div className="relative flex-1 min-w-45 max-w-xs">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, location, ID…"
            className="w-full text-xs pl-8 pr-8 py-2 border border-slate-200 rounded-xl
              bg-white text-slate-700 placeholder:text-slate-300
              focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300
                hover:text-slate-600"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <FilterSelect
          value={status}
          onChange={setStatus}
          placeholder="All Statuses"
          options={STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
        />
        <FilterSelect
          value={priority}
          onChange={setPriority}
          placeholder="All Priorities"
          options={PRIORITIES.map((p) => ({
            value: p,
            label: PRIORITY_LABELS[p],
          }))}
        />
        <FilterSelect
          value={category}
          onChange={setCategory}
          placeholder="All Categories"
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
        />

        {activeFilters > 0 && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-xs font-semibold
              text-red-500 hover:text-red-700 px-2.5 py-2 rounded-xl
              border border-red-200 hover:bg-red-50 transition-colors"
          >
            <X size={11} strokeWidth={2.5} />
            Clear {activeFilters > 1 ? `(${activeFilters})` : ''}
          </button>
        )}

        {activeFilters > 0 && (
          <span className="text-xs text-slate-400 font-medium">
            {totalFiltered} result{totalFiltered !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Table card ─────────────────────────────────────────────────────── */}
      {error ? (
        <div
          className="flex flex-col items-center justify-center py-24 rounded-2xl
          bg-[#FFFDF9] border border-slate-200"
        >
          <AlertCircle size={28} className="text-red-400 mb-3" />
          <p className="text-slate-700 font-semibold mb-1">
            Failed to load issues
          </p>
          <button
            onClick={fetchIssues}
            className="mt-3 text-sm bg-slate-800 text-white px-4 py-2 rounded-xl
              hover:bg-slate-700 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="bg-[#FFFDF9] rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-175">
              <thead className="border-b border-slate-100 bg-slate-50/80">
                <tr>
                  <Th col="id" label="#" className="w-14" />
                  <Th col="title" label="Title" />
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap w-36">
                    Citizen
                  </th>
                  <Th col="status" label="Status" className="w-33" />
                  <Th col="priority" label="Priority" className="w-28" />
                  <th
                    className="px-4 py-3 text-left text-[11px] font-bold uppercase
                    tracking-wider text-slate-400 whitespace-nowrap w-36"
                  >
                    Category
                  </th>
                  <Th col="upvotes" label="Upvotes" className="w-20" />
                  <Th col="created_at" label="Date" className="w-28" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <p className="text-slate-400 text-sm font-medium">
                        No issues match your filters.
                      </p>
                      {activeFilters > 0 && (
                        <button
                          onClick={resetFilters}
                          className="mt-2 text-xs text-blue-600 hover:underline font-semibold"
                        >
                          Clear filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  rows.map((issue) => (
                    <tr
                      key={issue.id}
                      onClick={() => navigate(`/admin/issues/${issue.id}`)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      {/* ID */}
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          #{issue.id}
                        </span>
                      </td>

                      {/* Title + location */}
                      <td className="px-4 py-3 max-w-xs">
                        <p
                          className="text-sm font-semibold text-slate-800 truncate
                          group-hover:text-blue-600 transition-colors"
                        >
                          {issue.title}
                        </p>
                        {issue.location && (
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin size={10} />
                            {issue.location}
                          </p>
                        )}
                      </td>
                      {/* Citizen — ADD THIS */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-600 font-medium">
                          {issue.citizen_name ?? '—'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={issue.status} size="sm" />
                      </td>

                      {/* Priority */}
                      <td className="px-4 py-3">
                        <PriorityBadge priority={issue.priority} size="sm" />
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-500 font-medium">
                          {issue.category}
                        </span>
                      </td>

                      {/* Upvotes */}
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1 text-xs
                          font-semibold text-slate-500"
                        >
                          <ThumbsUp size={11} />
                          {issue.upvote_count ?? 0}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                          <Calendar size={10} />
                          {formatDate(issue.created_at)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && !error && (
            <Pagination
              page={page}
              totalPages={totalPages}
              totalFiltered={totalFiltered}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              pageSizeOptions={pageSizeOptions}
              rowCount={rows.length}
            />
          )}
        </div>
      )}
    </div>
  )
}
