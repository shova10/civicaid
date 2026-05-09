import { useEffect, useState } from 'react'
import { Phone, MapPin, Calendar, Mail, User } from 'lucide-react'
import toast from 'react-hot-toast'
import IssueCard from '../components/IssueCard'
import useAuth from '../hooks/useAuth'
import { getMyOwnIssues } from '../services/issues'
import { getProfile } from '../services/auth'

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} className="text-slate-500" />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-700">{value || '—'}</p>
      </div>
    </div>
  )
}

export default function Profile() {
  const { user } = useAuth()

  const [profile, setProfile] = useState(null)
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    async function fetchAll() {
      try {
        const [profileData, issuesData] = await Promise.all([
          getProfile(),
          getMyOwnIssues(),
        ])
        console.log('profileData:', profileData)
        setProfile(profileData)
        setIssues(Array.isArray(issuesData) ? issuesData : [])
      } catch {
        toast.error('Could not load profile data.')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const total = issues.length
  const resolved = issues.filter((i) => i.status === 'resolved').length
  const reported = issues.filter((i) => i.status === 'reported').length
  const inProgress = issues.filter((i) => i.status === 'in_progress').length

  const filteredIssues = filter
    ? issues.filter((i) => i.status === filter)
    : issues

  // Use profile data if available, fall back to auth context
  const displayName =
    profile?.full_name ?? profile?.name ?? user?.name ?? 'User'
  const displayEmail = profile?.email ?? user?.email ?? '—'
  const displayPhone = profile?.phone ?? '—'
  const displayAddr = profile?.address ?? '—'

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-5xl mx-auto space-y-5 animate-pulse">
          <div className="h-36 bg-white rounded-2xl border border-slate-200" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-white rounded-2xl border border-slate-200"
              />
            ))}
          </div>
          <div className="h-64 bg-white rounded-2xl border border-slate-200" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* ── Profile header ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-20 bg-linear-to-r from-blue-500 to-blue-600" />
          <div className="px-6 pb-6">
            <div className="-mt-8 flex items-end justify-between mb-4">
              <div
                className="w-16 h-16 rounded-2xl bg-blue-50 border-4 border-white
                shadow-md flex items-center justify-center text-2xl font-black text-blue-600"
              >
                {displayName?.[0]?.toUpperCase() ?? '?'}
              </div>
              <span
                className="text-xs font-bold uppercase tracking-wider
                text-blue-600 bg-blue-50 border border-blue-200
                px-3 py-1 rounded-full "
              >
                {user?.role ?? 'Citizen'}
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900 mb-0.5">
              {displayName}
            </h1>
            <p className="text-sm text-slate-500">{displayEmail}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Personal info ─────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Personal Information
              </h2>
              <InfoRow icon={User} label="Full Name" value={displayName} />
              <InfoRow icon={Mail} label="Email" value={displayEmail} />
              <InfoRow icon={Phone} label="Phone" value={displayPhone} />
              <InfoRow icon={MapPin} label="Address" value={displayAddr} />
            </div>
          </div>

          {/* ── Stats + Issues ────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total', value: total, color: 'text-slate-800' },
                { label: 'Reported', value: reported, color: 'text-blue-600' },
                {
                  label: 'In Progress',
                  value: inProgress,
                  color: 'text-violet-600',
                },
                {
                  label: 'Resolved',
                  value: resolved,
                  color: 'text-emerald-600',
                },
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

            {/* Issues */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  My Issues
                </h2>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="text-xs font-medium border border-slate-200 rounded-xl
                    px-3 py-1.5 bg-white text-slate-600 focus:outline-none
                    focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">All</option>
                  <option value="reported">Reported</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {filteredIssues.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <p className="text-slate-400 text-sm font-medium">
                    No issues found.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredIssues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
