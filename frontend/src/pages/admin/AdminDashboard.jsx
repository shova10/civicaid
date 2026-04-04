import { useEffect, useState } from 'react'
import {
  ClipboardList,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Users,
  ThumbsUp,
  TrendingUp,
  Clock,
  RefreshCw,
} from 'lucide-react'
import toast from 'react-hot-toast'
import StatCard from '../../components/admin/StatCard'
import { getAdminSummary } from '../../services/issues'

function CategoryBreakdown({ data = [], loading }) {
  const max = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
        Issues by Category
      </h2>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-28 h-3 bg-slate-100 rounded-full shrink-0" />
              <div className="flex-1 h-5 bg-slate-100 rounded-full" />
              <div className="w-6 h-3 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2.5">
          {data.map((item) => (
            <div key={item.category} className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium w-28 shrink-0 truncate">
                {item.category}
              </span>
              <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-600 w-5 text-right shrink-0">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Priority breakdown ───────────────────────────────────────────────────────
const PRIORITY_CONFIG = {
  critical: { color: 'bg-red-500', label: 'Critical' },
  high: { color: 'bg-orange-400', label: 'High' },
  medium: { color: 'bg-yellow-400', label: 'Medium' },
  low: { color: 'bg-slate-300', label: 'Low' },
}

function PriorityBreakdown({ data = [], total = 0, loading }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
        Issues by Priority
      </h2>
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-100" />
                <div className="w-14 h-3 bg-slate-100 rounded-full" />
              </div>
              <div className="w-20 h-3 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stacked bar */}
          <div className="flex rounded-full overflow-hidden h-3 mb-4 gap-0.5">
            {data.map((item) => {
              const cfg = PRIORITY_CONFIG[item.priority]
              const pct = total > 0 ? (item.count / total) * 100 : 0
              return (
                <div
                  key={item.priority}
                  className={`${cfg.color} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                  title={`${cfg.label}: ${item.count}`}
                />
              )
            })}
          </div>
          <div className="space-y-2">
            {data.map((item) => {
              const cfg = PRIORITY_CONFIG[item.priority] ?? {
                color: 'bg-slate-300',
                label: item.priority,
              }
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0
              return (
                <div
                  key={item.priority}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.color}`}
                    />
                    <span className="text-xs text-slate-600 font-medium">
                      {cfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{pct}%</span>
                    <span className="text-xs font-bold text-slate-700 w-4 text-right">
                      {item.count}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  async function fetchSummary() {
    setLoading(true)
    setError(false)
    try {
      const data = await getAdminSummary()
      setSummary(data)
    } catch (err) {
      setError(true)
      toast.error(
        err?.response?.data?.message ?? 'Could not load dashboard data.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            System overview — all issues across Nepal
          </p>
        </div>
        <button
          onClick={fetchSummary}
          disabled={loading}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500
            hover:text-slate-800 px-3 py-2 rounded-xl border border-slate-200
            hover:bg-slate-50 transition-all disabled:opacity-40"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <AlertTriangle size={32} className="text-red-400 mb-3" />
          <p className="text-slate-700 font-semibold mb-1">
            Failed to load dashboard
          </p>
          <p className="text-slate-400 text-sm mb-4">
            Check your connection and try again.
          </p>
          <button
            onClick={fetchSummary}
            className="text-sm bg-slate-800 text-white px-4 py-2 rounded-xl
              hover:bg-slate-700 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* ── Stat cards grid ───────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={ClipboardList}
              label="Total Issues"
              value={summary?.total_issues}
              sub="All time"
              accent="blue"
              loading={loading}
            />
            <StatCard
              icon={Loader2}
              label="In Progress"
              value={summary?.in_progress}
              sub={`${summary?.open_issues ?? '—'} open`}
              accent="amber"
              loading={loading}
            />
            <StatCard
              icon={CheckCircle2}
              label="Resolved"
              value={summary?.resolved_issues}
              sub={`${summary?.resolution_rate ?? '—'}% resolution rate`}
              accent="emerald"
              loading={loading}
            />
            <StatCard
              icon={AlertTriangle}
              label="Critical"
              value={summary?.critical_issues}
              sub="Need urgent action"
              accent="red"
              loading={loading}
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Users}
              label="Total Users"
              value={summary?.total_users}
              sub={`+${summary?.new_users_today ?? 0} today`}
              accent="violet"
              loading={loading}
            />
            <StatCard
              icon={ThumbsUp}
              label="Total Upvotes"
              value={summary?.total_upvotes}
              sub="Across all issues"
              accent="blue"
              loading={loading}
            />
            <StatCard
              icon={TrendingUp}
              label="Resolution Rate"
              value={summary ? `${summary.resolution_rate}%` : null}
              sub="Issues resolved"
              accent="emerald"
              loading={loading}
            />
            <StatCard
              icon={Clock}
              label="Avg Resolve"
              value={summary ? `${summary.avg_resolve_days}d` : null}
              sub="Average days to resolve"
              accent="slate"
              loading={loading}
            />
          </div>

          {/* ── Breakdown charts ──────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CategoryBreakdown data={summary?.by_category} loading={loading} />
            <PriorityBreakdown
              data={summary?.by_priority}
              total={summary?.total_issues}
              loading={loading}
            />
          </div>
        </>
      )}
    </div>
  )
}
