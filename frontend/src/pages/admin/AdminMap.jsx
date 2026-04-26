import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CircleMarker, Popup } from 'react-leaflet'
import { AlertCircle, RefreshCw, Map } from 'lucide-react'
import toast from 'react-hot-toast'
import NepalMap from '../../components/NepalMap'
import MapFilters from '../../components/MapFilters'
import StatusBadge from '../../components/StatusBadge'
import PriorityBadge from '../../components/PriorityBadge'
import useMapFilters from '../../hooks/useMapFilters'
import { getHeatmapData, getAdminIssues } from '../../services/issues'

const PRIORITY_STYLE = {
  critical: { color: '#ef4444', fillColor: '#ef4444', radius: 14 },
  high: { color: '#f97316', fillColor: '#f97316', radius: 11 },
  medium: { color: '#eab308', fillColor: '#eab308', radius: 9 },
  low: { color: '#64748b', fillColor: '#64748b', radius: 7 },
  High: { color: '#f97316', fillColor: '#f97316', radius: 11 },
  Medium: { color: '#eab308', fillColor: '#eab308', radius: 9 },
  Low: { color: '#64748b', fillColor: '#64748b', radius: 7 },
  none: { color: '#94a3b8', fillColor: '#94a3b8', radius: 6 },
}

const LEGEND_ITEMS = [
  { priority: 'critical', label: 'Critical', color: '#ef4444' },
  { priority: 'high', label: 'High', color: '#f97316' },
  { priority: 'medium', label: 'Medium', color: '#eab308' },
  { priority: 'low', label: 'Low', color: '#64748b' },
]

function Legend() {
  return (
    <div
      className="absolute bottom-8 left-4 z-1000 bg-white/90 backdrop-blur-sm
      rounded-xl border border-slate-200 shadow-md px-3 py-2.5 flex flex-col gap-1.5"
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
        Priority
      </p>
      {LEGEND_ITEMS.map((item) => (
        <div key={item.priority} className="flex items-center gap-2">
          <span
            className="inline-block rounded-full border-2 shrink-0"
            style={{
              width: 12,
              height: 12,
              backgroundColor: item.color + '55',
              borderColor: item.color,
            }}
          />
          <span className="text-xs text-slate-600 font-medium">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

function StatsBar({ issues }) {
  const counts = issues.reduce((acc, i) => {
    acc[i.priority] = (acc[i.priority] ?? 0) + 1
    return acc
  }, {})
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm font-semibold text-slate-700">
        {issues.length} {issues.length === 1 ? 'issue' : 'issues'} plotted
      </span>
      <div className="flex items-center gap-2 flex-wrap">
        {LEGEND_ITEMS.map((item) =>
          counts[item.priority] ? (
            <span
              key={item.priority}
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: item.color + '18',
                color: item.color,
                border: `1px solid ${item.color}40`,
              }}
            >
              {counts[item.priority]} {item.label}
            </span>
          ) : null
        )}
      </div>
    </div>
  )
}

export default function AdminMap() {
  const navigate = useNavigate()
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const {
    filters,
    setCategory,
    setPriority,
    setStatus,
    filtered,
    reset,
    activeCount,
  } = useMapFilters(issues)

  async function fetchData() {
    setLoading(true)
    setError(false)
    try {
      let data = await getHeatmapData()

      if (!data || data.length === 0) {
        const complaints = await getAdminIssues()
        const list = Array.isArray(complaints)
          ? complaints
          : (complaints.results ?? [])

        data = list.map((c) => ({
          ...c,
          lat: c.lat ?? (c.latitude ? parseFloat(c.latitude) : null),
          lng: c.lng ?? (c.longitude ? parseFloat(c.longitude) : null),
        }))
      } else {
        data = data.map((c) => ({
          ...c,
          lat: c.lat ?? (c.latitude ? parseFloat(c.latitude) : null),
          lng: c.lng ?? (c.longitude ? parseFloat(c.longitude) : null),
        }))
      }

      setIssues(data)
    } catch (err) {
      setError(true)
      toast.error(err?.response?.data?.message ?? 'Could not load map data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Issue Map
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              All reported issues across Nepal
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!loading && !error && <StatsBar issues={filtered} />}
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500
                hover:text-slate-800 px-3 py-2 rounded-xl border border-slate-200
                hover:bg-slate-50 transition-all disabled:opacity-40"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {!loading && !error && (
          <MapFilters
            filters={filters}
            setCategory={setCategory}
            setPriority={setPriority}
            setStatus={setStatus}
            reset={reset}
            activeCount={activeCount}
            total={issues.length}
            showing={filtered.length}
          />
        )}
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center h-96 rounded-2xl bg-white border border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-3">
            <AlertCircle size={24} className="text-red-400" />
          </div>
          <p className="text-slate-700 font-semibold mb-1">
            Failed to load map data
          </p>
          <button
            onClick={fetchData}
            className="mt-3 inline-flex items-center gap-2 text-sm bg-slate-800 text-white
              px-4 py-2 rounded-xl hover:bg-slate-700 transition-colors font-medium"
          >
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      ) : (
        <div className="relative" style={{ isolation: 'isolate' }}>
          {loading && (
            <div
              className="absolute inset-0 z-1001 flex items-center justify-center
              bg-white/70 backdrop-blur-sm rounded-2xl"
            >
              <div className="flex items-center gap-3 bg-white rounded-xl shadow-md border border-slate-200 px-5 py-3">
                <Map size={18} className="text-blue-500 animate-pulse" />
                <span className="text-sm font-medium text-slate-600">
                  Loading issues…
                </span>
              </div>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div
              className="absolute inset-0 z-1001 flex items-center justify-center
              bg-white/60 backdrop-blur-sm rounded-2xl"
            >
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md px-6 py-5 text-center">
                <p className="text-slate-700 font-semibold mb-1">
                  No issues match your filters
                </p>
                <button
                  onClick={reset}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}

          <NepalMap className="h-150">
            {filtered
              .filter((issue) => issue.lat && issue.lng)
              .map((issue) => {
                const style =
                  PRIORITY_STYLE[issue.priority] ?? PRIORITY_STYLE.none
                return (
                  <CircleMarker
                    key={issue.id}
                    center={[issue.lat, issue.lng]}
                    radius={style.radius}
                    pathOptions={{
                      color: style.color,
                      fillColor: style.fillColor,
                      fillOpacity: 0.45,
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div className="p-1 min-w-50">
                        <p className="text-sm font-semibold text-slate-800 leading-snug mb-2">
                          {issue.title}
                        </p>
                        <div className="flex items-center gap-1.5 mb-3">
                          <StatusBadge status={issue.status} size="sm" />
                          <PriorityBadge priority={issue.priority} size="sm" />
                        </div>
                        <p className="text-xs text-slate-400 mb-3">
                          {issue.category}
                        </p>
                        <button
                          onClick={() => navigate(`/issues/${issue.id}`)}
                          className="w-full text-xs font-semibold text-white bg-blue-600
                            hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          View Issue →
                        </button>
                      </div>
                    </Popup>
                  </CircleMarker>
                )
              })}
          </NepalMap>

          <Legend />
        </div>
      )}
    </div>
  )
}
