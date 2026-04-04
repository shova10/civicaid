// src/pages/admin/AdminAnalytics.jsx
import { useEffect, useState } from 'react'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
} from 'recharts'
import { getAdminSummary } from '../../services/issues'

// ─── Colour palette ───────────────────────────────────────────────────────────
const CATEGORY_COLORS = ['#3b82f6', '#f97316', '#10b981', '#eab308', '#8b5cf6']

const PRIORITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#64748b',
}

const TREND_DATA = [
  { month: 'Oct', submitted: 18, resolved: 10 },
  { month: 'Nov', submitted: 24, resolved: 15 },
  { month: 'Dec', submitted: 20, resolved: 18 },
  { month: 'Jan', submitted: 32, resolved: 22 },
  { month: 'Feb', submitted: 28, resolved: 25 },
  { month: 'Mar', submitted: 15, resolved: 12 },
]

// ─── Custom tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2.5">
      {label && (
        <p className="text-xs font-bold text-slate-500 mb-1">{label}</p>
      )}
      {payload.map((p) => (
        <p
          key={p.name}
          className="text-xs font-semibold"
          style={{ color: p.color ?? p.fill }}
        >
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

// ─── Chart card wrapper ───────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children, loading }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-slate-800">{title}</h2>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>
      {loading ? (
        <div className="h-56 bg-slate-50 rounded-xl animate-pulse" />
      ) : (
        children
      )}
    </div>
  )
}

// ─── Custom pie label ─────────────────────────────────────────────────────────
function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.07) return null
  const RADIAN = Math.PI / 180
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminAnalytics() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  async function fetchData() {
    setLoading(true)
    setError(false)
    try {
      const data = await getAdminSummary()
      setSummary(data)
    } catch (err) {
      console.error('Admin summary error:', err)
      setError(true)
      toast.error('Could not load analytics data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Shape data for recharts
  const categoryData =
    summary?.by_category?.map((d) => ({
      name: d.category.replace(' & ', ' &\n'),
      count: d.count,
    })) ?? []

  const priorityData =
    summary?.by_priority?.map((d) => ({
      name: d.priority.charAt(0).toUpperCase() + d.priority.slice(1),
      value: d.count,
      color: PRIORITY_COLORS[d.priority],
    })) ?? []

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Issue trends and breakdowns
          </p>
        </div>
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

      {error ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <AlertTriangle size={32} className="text-red-400 mb-3" />
          <p className="text-slate-700 font-semibold mb-1">
            Failed to load analytics
          </p>
          <button
            onClick={fetchData}
            className="mt-3 text-sm bg-slate-800 text-white px-4 py-2 rounded-xl
              hover:bg-slate-700 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* ── Bar chart — issues by category ─────────────────────────── */}
          <ChartCard
            title="Issues by Category"
            subtitle="Total reported per department"
            loading={loading}
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={categoryData}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  width={60}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar
                  dataKey="count"
                  name="Issues"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                >
                  {categoryData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ── Pie chart — issues by priority ─────────────────────────── */}
          <ChartCard
            title="Priority Distribution"
            subtitle="Share of issues by urgency level"
            loading={loading}
          >
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={priorityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  labelLine={false}
                  label={PieLabel}
                >
                  {priorityData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#64748b',
                      }}
                    >
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ── Line chart — submission vs resolution trend ─────────────── */}
          <ChartCard
            title="Submission vs Resolution Trend"
            subtitle="Last 6 months — issues submitted vs resolved"
            loading={loading}
          >
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={TREND_DATA}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#64748b',
                      }}
                    >
                      {value}
                    </span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="submitted"
                  name="Submitted"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  name="Resolved"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ── Bar chart — resolution rate by status ───────────────────── */}
          <ChartCard
            title="Current Status Breakdown"
            subtitle="Live count of issues per status"
            loading={loading}
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                layout="vertical"
                data={[
                  {
                    name: 'Pending',
                    count:
                      (summary?.total_issues ?? 0) -
                      (summary?.open_issues ?? 0) -
                      (summary?.in_progress ?? 0) -
                      (summary?.resolved_issues ?? 0),
                    fill: '#eab308',
                  },
                  {
                    name: 'Open',
                    count: summary?.open_issues ?? 0,
                    fill: '#3b82f6',
                  },
                  {
                    name: 'In Progress',
                    count: summary?.in_progress ?? 0,
                    fill: '#8b5cf6',
                  },
                  {
                    name: 'Resolved',
                    count: summary?.resolved_issues ?? 0,
                    fill: '#10b981',
                  },
                ]}
                margin={{ top: 4, right: 16, left: 4, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                  tickLine={false}
                  axisLine={false}
                  width={72}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar
                  dataKey="count"
                  name="Issues"
                  radius={[0, 6, 6, 0]}
                  maxBarSize={24}
                >
                  {[0, 1, 2, 3].map((i) => (
                    <Cell
                      key={i}
                      fill={['#eab308', '#3b82f6', '#8b5cf6', '#10b981'][i]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </div>
  )
}
