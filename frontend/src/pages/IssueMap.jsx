import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CircleMarker, Popup } from 'react-leaflet'
import { AlertCircle, RefreshCw, Map } from 'lucide-react'
import toast from 'react-hot-toast'
import NepalMap from '../components/NepalMap'
import MapFilters from '../components/MapFilters'
import StatusBadge from '../components/StatusBadge'
import PriorityBadge from '../components/PriorityBadge'
import useMapFilters from '../hooks/useMapFilters'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { getHeatmapData, getAllIssues } from '../services/issues'

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
    <div className="flex items-center gap-4 flex-wrap">
      <span className="text-sm font-semibold text-slate-700">
        {issues.length} issues plotted
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

export default function IssueMap() {
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

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(false)
      try {
        let data = await getHeatmapData()

        if (!data || data.length === 0) {
          const complaints = await getAllIssues()
          const list = Array.isArray(complaints)
            ? complaints
            : (complaints.results ?? [])
          data = list.map((c) => ({
            ...c,
            lat: c.location_lat ?? null,
            lng: c.location_lng ?? null,
          }))
        }
        setIssues(data.filter((d) => d.lat && d.lng))

        setIssues(data)
      } catch (err) {
        setError(true)
        toast.error(err?.response?.data?.message ?? 'Could not load map data.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Issue Map
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Live civic issues across the Kathmandu Valley
            </p>
          </div>
          {!loading && !error && <StatsBar issues={issues} />}
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

        {error ? (
          <div className="flex flex-col items-center justify-center h-96 rounded-2xl bg-white border border-slate-200">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-3">
              <AlertCircle size={24} className="text-red-400" />
            </div>
            <p className="text-slate-700 font-semibold mb-1">
              Failed to load map data
            </p>
            <p className="text-slate-400 text-sm mb-4">
              Check your connection and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 text-sm bg-slate-800 text-white
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

            <NepalMap className="h-140">
              <MarkerClusterGroup>
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
                              <PriorityBadge
                                priority={issue.priority}
                                size="sm"
                              />
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
              </MarkerClusterGroup>
            </NepalMap>

            <Legend />
          </div>
        )}
      </div>
    </div>
  )
}
