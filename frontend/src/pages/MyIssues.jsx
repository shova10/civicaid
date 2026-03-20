// src/pages/MyIssues.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, AlertCircle, ClipboardList, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import IssueCard from '../components/IssueCard'
import { getMyIssues } from '../services/issues'

// ─── Filter options ────────────────────────────────────────────────────────────
const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'priority', label: 'Priority' },
]

const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3, none: 4 }

// ─── Skeleton loader ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-36 bg-slate-100" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-slate-100 rounded-full w-3/4" />
        <div className="h-3 bg-slate-100 rounded-full w-full" />
        <div className="h-3 bg-slate-100 rounded-full w-5/6" />
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-16 bg-slate-100 rounded-full" />
          <div className="h-5 w-14 bg-slate-100 rounded-full" />
        </div>
      </div>
      <div className="border-t border-slate-100 px-4 py-2.5 bg-slate-50">
        <div className="h-3 bg-slate-100 rounded-full w-1/3" />
      </div>
    </div>
  )
}

// ─── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ hasFilters, onClear }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <ClipboardList size={28} className="text-slate-400" />
      </div>
      {hasFilters ? (
        <>
          <h3 className="text-slate-700 font-semibold text-base mb-1">
            No issues match your filters
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            Try changing the status filter or sort order.
          </p>
          <button
            onClick={onClear}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
          >
            Clear filters
          </button>
        </>
      ) : (
        <>
          <h3 className="text-slate-700 font-semibold text-base mb-1">
            No issues reported yet
          </h3>
          <p className="text-slate-400 text-sm">
            When you report a civic issue, it will appear here.
          </p>
        </>
      )}
    </div>
  )
}

// ─── Error state ───────────────────────────────────────────────────────────────
function ErrorState({ onRetry }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle size={28} className="text-red-400" />
      </div>
      <h3 className="text-slate-700 font-semibold text-base mb-1">
        Failed to load issues
      </h3>
      <p className="text-slate-400 text-sm mb-5">
        Something went wrong while fetching your issues.
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 text-sm bg-slate-800 text-white
          px-4 py-2 rounded-xl hover:bg-slate-700 transition-colors font-medium"
      >
        <RefreshCw size={14} />
        Try again
      </button>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function MyIssues() {
  const navigate = useNavigate()

  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [statusFilter, setStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  async function fetchIssues() {
    setLoading(true)
    setError(false)
    try {
      const data = await getMyIssues()
      setIssues(data)
    } catch (err) {
      setError(true)
      toast.error(err?.response?.data?.message ?? 'Could not load your issues.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('API BASE URL:', import.meta.env.VITE_API_URL)
    fetchIssues()
  }, [])

  // ─── Filter + sort ───────────────────────────────────────────────────────────
  const filtered = issues
    .filter((i) => statusFilter === 'all' || i.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === 'newest')
        return new Date(b.created_at) - new Date(a.created_at)
      if (sortBy === 'oldest')
        return new Date(a.created_at) - new Date(b.created_at)
      if (sortBy === 'priority')
        return (
          (PRIORITY_ORDER[a.priority] ?? 99) -
          (PRIORITY_ORDER[b.priority] ?? 99)
        )
      return 0
    })

  const hasFilters = statusFilter !== 'all'

  // ─── Counts for filter pills ─────────────────────────────────────────────────
  const counts = issues.reduce((acc, i) => {
    acc[i.status] = (acc[i.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              My Issues
            </h1>
            {!loading && !error && (
              <p className="text-sm text-slate-400 mt-0.5">
                {issues.length} {issues.length === 1 ? 'issue' : 'issues'}{' '}
                reported
              </p>
            )}
          </div>
          <button
            onClick={() => navigate('/submit-issue')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700
              text-white text-sm font-semibold px-4 py-2.5 rounded-xl
              transition-colors duration-150 shadow-sm shadow-blue-200 self-start sm:self-auto"
          >
            <Plus size={16} strokeWidth={2.5} />
            Report Issue
          </button>
        </div>

        {/* ── Filters bar ────────────────────────────────────────────────────── */}
        {!error && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            {/* Status filter pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {STATUS_FILTERS.map((f) => {
                const count =
                  f.value === 'all' ? issues.length : (counts[f.value] ?? 0)
                const active = statusFilter === f.value
                return (
                  <button
                    key={f.value}
                    onClick={() => setStatus(f.value)}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5
                      rounded-full border transition-all duration-150
                      ${
                        active
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                  >
                    {f.label}
                    {!loading && (
                      <span
                        className={`text-[10px] font-bold rounded-full px-1.5 py-0.5
                          ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Sort select — pushed to end */}
            <div className="sm:ml-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-medium text-slate-600 bg-white border border-slate-200
                  rounded-xl px-3 py-2 cursor-pointer hover:border-slate-300
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* ── Grid ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : error ? (
            <ErrorState onRetry={fetchIssues} />
          ) : filtered.length === 0 ? (
            <EmptyState
              hasFilters={hasFilters}
              onClear={() => setStatus('all')}
            />
          ) : (
            filtered.map((issue) => <IssueCard key={issue.id} issue={issue} />)
          )}
        </div>
      </div>
    </div>
  )
}
