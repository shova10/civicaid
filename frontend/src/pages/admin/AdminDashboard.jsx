import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ClipboardList,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Copy,
  RefreshCw,
} from 'lucide-react'
import toast from 'react-hot-toast'
import StatCard from '../../components/admin/StatCard'
import { getAdminSummary } from '../../services/issues'

function objectToArray(obj, keyName) {
  if (!obj || typeof obj !== 'object') return []
  return Object.entries(obj).map(([key, value]) => ({
    [keyName]: key,
    count: value,
  }))
}

// ─── Category breakdown ───────────────────────────────────────────────────────
function CategoryBreakdown({ data = [], loading }) {
  const safeData = Array.isArray(data) ? data : []
  const max = Math.max(...safeData.map((d) => d.count), 1)
  const navigate = useNavigate()

  return (
    <div className="bg-[#F6F1E8] rounded-2xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
        Issues by Category
      </h2>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-28 h-3 bg-slate-100 rounded-full shrink-0" />
              <div className="flex-1 h-5 bg-slate-100 rounded-full" />
              <div className="w-6 h-3 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>
      ) : safeData.length === 0 ? (
        <p className="text-xs text-slate-400">No category data available.</p>
      ) : (
        <div className="space-y-2.5">
          {safeData.map((item) => (
            <div
              key={item.category}
              onClick={() =>
                navigate(`/admin/issues?category=${item.category}`)
              }
              className="flex items-center gap-3"
            >
              <span className="text-xs text-slate-500 font-medium w-28 shrink-0 truncate capitalize">
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

// ─── Status breakdown ─────────────────────────────────────────────────────────
const STATUS_COLORS = {
  reported: 'bg-amber-400',
  open: 'bg-blue-500',
  in_progress: 'bg-violet-500',
  resolved: 'bg-emerald-500',
  closed: 'bg-slate-400',
  rejected: 'bg-red-400',
}

function StatusBreakdown({ data = [], total = 0, loading }) {
  const safeData = Array.isArray(data) ? data : []
  const navigate = useNavigate()

  return (
    <div className="bg-[#F6F1E8] rounded-2xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
        Issues by Status
      </h2>
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-100" />
                <div className="w-14 h-3 bg-slate-100 rounded-full" />
              </div>
              <div className="w-20 h-3 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>
      ) : safeData.length === 0 ? (
        <p className="text-xs text-slate-400">No status data available.</p>
      ) : (
        <>
          <div className="flex rounded-full overflow-hidden h-3 mb-4 gap-0.5">
            {safeData.map((item) => {
              const color = STATUS_COLORS[item.status] ?? 'bg-slate-300'
              const pct = total > 0 ? (item.count / total) * 100 : 0
              return (
                <div
                  key={item.status}
                  onClick={() =>
                    navigate(`/admin/issues?status=${item.status}`)
                  }
                  className={`${color} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                  title={`${item.status}: ${item.count}`}
                />
              )
            })}
          </div>
          <div className="space-y-2">
            {safeData.map((item) => {
              const color = STATUS_COLORS[item.status] ?? 'bg-slate-300'
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0
              return (
                <div
                  key={item.status}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${color}`}
                    />
                    <span className="text-xs text-slate-600 font-medium capitalize">
                      {item.status.replace('_', ' ')}
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
  const navigate = useNavigate()

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

  const categoryData = objectToArray(summary?.by_category, 'category')
  const statusData = objectToArray(summary?.by_status, 'status')

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            System overview — all issues
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
          <button
            onClick={fetchSummary}
            className="mt-4 text-sm bg-slate-800 text-white px-4 py-2 rounded-xl
              hover:bg-slate-700 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={ClipboardList}
              label="Total Issues"
              value={summary?.total}
              sub="All time"
              accent="blue"
              loading={loading}
              onClick={() => navigate('/admin/issues')}
            />
            <StatCard
              icon={Loader2}
              label="Reported"
              value={summary?.by_status?.reported}
              sub="Currently reported"
              accent="amber"
              loading={loading}
              onClick={() => navigate('/admin/issues?status=reported')}
            />
            <StatCard
              icon={CheckCircle2}
              label="Resolved"
              value={summary?.by_status?.resolved ?? 0}
              sub="Issues resolved"
              accent="emerald"
              loading={loading}
              onClick={() => navigate('/admin/issues?status=resolved')}
            />
            <StatCard
              icon={Copy}
              label="Duplicates"
              value={summary?.duplicates}
              sub="Duplicate issues found"
              accent="red"
              loading={loading}
              onClick={() => navigate('/admin/issues?duplicate=true')}
            />
          </div>

          {/* Breakdown charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CategoryBreakdown data={categoryData} loading={loading} />
            <StatusBreakdown
              data={statusData}
              total={summary?.total ?? 0}
              loading={loading}
            />
          </div>
        </>
      )}
    </div>
  )
}
