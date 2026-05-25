import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  User,
  Wrench,
  UserCheck,
  UserX,
  Hash,
} from 'lucide-react'
import Avatar from '../../components/Avatar'
import toast from 'react-hot-toast'
import { updateUserRole, toggleUserActive } from '../../services/auth'
import api from '../../services/api'
import StatusBadge from '../../components/StatusBadge'
import PriorityBadge from '../../components/PriorityBadge'

const ROLE_CONFIG = {
  admin: {
    label: 'Admin',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    Icon: Shield,
  },
  staff: {
    label: 'Staff',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    Icon: Wrench,
  },
  citizen: {
    label: 'Citizen',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    Icon: User,
  },
}

function RoleBadge({ role }) {
  const cfg = ROLE_CONFIG[role] ?? ROLE_CONFIG.citizen
  const { Icon } = cfg
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold
      px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <Icon size={10} />
      {cfg.label}
    </span>
  )
}

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

function formatDate(d) {
  if (!d || d === '' || d === 'null') return '—'
  const date = new Date(d)
  if (isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-5">
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
  )
}

export default function AdminUserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(false)
      try {
        const [userData, issuesRes] = await Promise.all([
          api.get(`/api/admin/users/${id}/`).then((r) => r.data),
          api.get(`/api/admin/users/${id}/complaints/`),
        ])
        setUser(userData)
        setIssues(
          Array.isArray(issuesRes.data)
            ? issuesRes.data
            : (issuesRes.data.results ?? [])
        )
      } catch (err) {
        setError(true)
        toast.error('Could not load user details.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  async function handleToggleActive() {
    try {
      await toggleUserActive(user.id, !user.is_active)
      setUser((prev) => ({ ...prev, is_active: !prev.is_active }))
      toast.success(user.is_active ? 'User deactivated' : 'User activated')
    } catch {
      toast.error('Could not update user status.')
    }
  }

  async function handleRoleChange(newRole) {
    try {
      await updateUserRole(user.id, newRole)
      setUser((prev) => ({ ...prev, role: newRole }))
      toast.success(`Role updated to ${newRole}`)
    } catch {
      toast.error('Could not update user role.')
    }
  }

  const filteredIssues = statusFilter
    ? issues.filter((i) => i.status === statusFilter)
    : issues

  const displayName = user?.full_name ?? user?.name ?? user?.username ?? 'User'

  const total = issues.length
  const resolved = issues.filter((i) => i.status === 'resolved').length
  const inProgress = issues.filter((i) => i.status === 'in_progress').length
  const reported = issues.filter((i) => i.status === 'reported').length

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/admin/users')}
        className="inline-flex items-center gap-2 text-sm text-slate-500
          hover:text-slate-800 font-medium transition-colors mb-6 group"
      >
        <ArrowLeft
          size={15}
          className="group-hover:-translate-x-0.5 transition-transform duration-150"
        />
        Back to Users
      </button>

      {loading ? (
        <Skeleton />
      ) : error || !user ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h2 className="text-slate-700 font-semibold text-lg mb-1">
            User not found
          </h2>
          <p className="text-slate-400 text-sm mb-5">
            This user doesn't exist or you don't have access.
          </p>
          <button
            onClick={() => navigate('/admin/users')}
            className="text-sm bg-slate-800 text-white px-4 py-2 rounded-xl
              hover:bg-slate-700 transition-colors font-medium"
          >
            Go back
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Profile header */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-20 bg-linear-to-r from-blue-500 to-violet-500" />
            <div className="px-6 pb-6">
              <div className="-mt-8 flex items-end justify-between mb-4">
                <Avatar
                  userId={user?.id}
                  name={displayName}
                  size="lg"
                  className="border-4 border-white shadow-md"
                />
                <div className="flex items-center gap-2 mt-8">
                  <RoleBadge role={user.role} />
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold
                    px-2.5 py-1 rounded-full border
                    ${
                      user.is_active
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        user.is_active ? 'bg-emerald-400' : 'bg-slate-300'
                      }`}
                    />
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <h1 className="text-xl font-black text-slate-900 mb-0.5">
                {displayName}
              </h1>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="space-y-5">
              {/* Personal info */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Personal Information
                </h2>
                <InfoRow icon={Mail} label="Email" value={user.email} />
                <InfoRow icon={Phone} label="Phone" value={user.phone} />
                <InfoRow icon={MapPin} label="Address" value={user.address} />
                <InfoRow
                  icon={Calendar}
                  label="Date of Birth"
                  value={formatDate(user.date_of_birth)}
                />
                <InfoRow
                  icon={Calendar}
                  label="Joined"
                  value={formatDate(user.date_joined)}
                />
              </div>

              {/* Admin controls */}
              {user.role !== 'admin' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Admin Controls
                  </h2>
                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        handleRoleChange(
                          user.role === 'staff' ? 'citizen' : 'staff'
                        )
                      }
                      className="w-full text-left text-xs font-semibold px-3 py-2.5
                        rounded-xl border border-slate-200 hover:bg-slate-50
                        text-slate-700 transition-colors flex items-center gap-2"
                    >
                      <Wrench size={12} />
                      {user.role === 'staff'
                        ? 'Demote to Citizen'
                        : 'Promote to Staff'}
                    </button>
                    <button
                      onClick={handleToggleActive}
                      className={`w-full text-left text-xs font-semibold px-3 py-2.5
                        rounded-xl border transition-colors flex items-center gap-2
                        ${
                          user.is_active
                            ? 'border-red-200 text-red-500 hover:bg-red-50'
                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                        }`}
                    >
                      {user.is_active ? (
                        <>
                          <UserX size={12} /> Deactivate User
                        </>
                      ) : (
                        <>
                          <UserCheck size={12} /> Activate User
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="lg:col-span-2 space-y-5">
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total', value: total, color: 'text-slate-800' },
                  {
                    label: 'Reported',
                    value: reported,
                    color: 'text-blue-600',
                  },
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
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center"
                  >
                    <p className={`text-2xl font-black ${s.color}`}>
                      {s.value}
                    </p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Issues table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Submitted Issues
                  </h2>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-xs font-medium border border-slate-200 rounded-xl
                      px-3 py-1.5 bg-white text-slate-600 focus:outline-none
                      focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">All</option>
                    <option value="reported">Reported</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {filteredIssues.length === 0 ? (
                  <div className="flex flex-col items-center py-10 text-center">
                    <p className="text-slate-400 text-sm font-medium">
                      No issues found.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-2 pr-4">
                            #
                          </th>
                          <th className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-2 pr-4">
                            Title
                          </th>
                          <th className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-2 pr-4">
                            Status
                          </th>
                          <th className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-2">
                            Priority
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredIssues.map((issue) => (
                          <tr
                            key={issue.id}
                            onClick={() =>
                              navigate(`/admin/issues/${issue.id}`)
                            }
                            className="hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <td className="py-3 pr-4">
                              <span className="text-xs font-mono text-slate-400">
                                #{issue.id}
                              </span>
                            </td>
                            <td className="py-3 pr-4">
                              <p className="font-medium text-slate-700 text-sm truncate max-w-48">
                                {issue.title}
                              </p>
                              <p className="text-xs text-slate-400">
                                {issue.category}
                              </p>
                            </td>
                            <td className="py-3 pr-4">
                              <StatusBadge status={issue.status} />
                            </td>
                            <td className="py-3">
                              <PriorityBadge priority={issue.priority} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
