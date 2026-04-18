import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import StatusBadge from '../components/StatusBadge'
import PriorityBadge from '../components/PriorityBadge'
import { getStaffIssues, staffUpdateStatus } from '../services/issues'
import useAuth from '../hooks/useAuth'

const QUICK_STATUSES = [
  {
    value: 'reported',
    label: 'Reported',
    color: 'text-blue-600   bg-blue-50   border-blue-200',
  },
  {
    value: 'in_progress',
    label: 'In Progress',
    color: 'text-violet-600 bg-violet-50 border-violet-200',
  },
  {
    value: 'resolved',
    label: 'Resolved',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    value: 'rejected',
    label: 'Rejected',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
]

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Quick status selector ────────────────────────────────────────────────────
function QuickStatusUpdate({ issue, onUpdated }) {
  const [loading, setLoading] = useState(false)

  async function handleUpdate(newStatus) {
    if (newStatus === issue.status) return
    setLoading(true)
    try {
      const updated = await staffUpdateStatus(issue.id, newStatus)
      toast.success(
        `Issue #${issue.id} marked as ${newStatus.replace('_', ' ')}.`
      )
      onUpdated(updated)
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Update failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {loading ? (
        <Loader2 size={14} className="animate-spin text-slate-400" />
      ) : (
        QUICK_STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => handleUpdate(s.value)}
            disabled={issue.status === s.value}
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border
              transition-all duration-150
              ${
                issue.status === s.value
                  ? s.color + ' opacity-100 cursor-default'
                  : 'text-slate-400 bg-white border-slate-200 hover:border-slate-300 hover:text-slate-600'
              }`}
          >
            {s.label}
          </button>
        ))
      )}
    </div>
  )
}

// ─── Issue row card ───────────────────────────────────────────────────────────
function IssueRow({ issue, onUpdated }) {
  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4
      hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold text-slate-300">
              #{issue.id}
            </span>
            <span className="text-xs text-slate-400">{issue.category}</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-800 leading-snug mb-2">
            {issue.title}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <StatusBadge status={issue.status} size="sm" />
            <PriorityBadge priority={issue.priority} size="sm" />
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock size={11} />
            Reported {formatDate(issue.created_at)}
          </div>
        </div>

        {/* Quick update */}
        <div className="shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Quick Update
          </p>
          <QuickStatusUpdate issue={issue} onUpdated={onUpdated} />
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Staff() {
  const { user } = useAuth()
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  async function fetchIssues() {
    setLoading(true)
    setError(false)
    try {
      const data = await getStaffIssues()
      setIssues(data)
    } catch (err) {
      setError(true)
      toast.error(
        err?.response?.data?.message ?? 'Could not load assigned issues.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIssues()
  }, [])

  function handleUpdated(updated) {
    setIssues((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
  }

  const reported = issues.filter((i) => i.status === 'reported').length
  const inProgress = issues.filter((i) => i.status === 'in_progress').length
  const resolved = issues.filter((i) => i.status === 'resolved').length

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              My Assignments
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Welcome back, {user?.name ?? 'Staff'}
            </p>
          </div>
          <button
            onClick={fetchIssues}
            disabled={loading}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500
              hover:text-slate-800 px-3 py-2 rounded-xl border border-slate-200
              hover:bg-white transition-all disabled:opacity-40"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Stats row */}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Reported', value: reported, color: 'text-blue-600' },
              {
                label: 'In Progress',
                value: inProgress,
                color: 'text-violet-600',
              },
              { label: 'Resolved', value: resolved, color: 'text-emerald-600' },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl border border-slate-200
                shadow-sm p-4 text-center"
              >
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse"
              >
                <div className="h-3 bg-slate-100 rounded-full w-1/4 mb-3" />
                <div className="h-4 bg-slate-100 rounded-full w-3/4 mb-4" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-slate-100 rounded-full" />
                  <div className="h-5 w-14 bg-slate-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
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
        ) : issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CheckCircle2 size={32} className="text-emerald-400 mb-3" />
            <p className="text-slate-700 font-semibold">All caught up!</p>
            <p className="text-slate-400 text-sm mt-1">
              No issues assigned to you.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {issues.map((issue) => (
              <IssueRow
                key={issue.id}
                issue={issue}
                onUpdated={handleUpdated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
