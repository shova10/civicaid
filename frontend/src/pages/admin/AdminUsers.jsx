import { useState, useMemo } from 'react'
import {
  Search,
  X,
  Shield,
  User,
  Wrench,
  MoreVertical,
  UserCheck,
  UserX,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from 'lucide-react'

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  {
    id: 1,
    name: 'Aarav Sharma',
    email: 'aarav@gmail.com',
    role: 'citizen',
    joined: '2025-01-05',
    issues: 7,
    active: true,
  },
  {
    id: 2,
    name: 'Sita Karki',
    email: 'sita@civicaid.np',
    role: 'staff',
    joined: '2025-01-10',
    issues: 0,
    active: true,
  },
  {
    id: 3,
    name: 'Bikram Thapa',
    email: 'bikram@civicaid.np',
    role: 'staff',
    joined: '2025-01-10',
    issues: 0,
    active: true,
  },
  {
    id: 4,
    name: 'Priya Maharjan',
    email: 'priya@yahoo.com',
    role: 'citizen',
    joined: '2025-02-14',
    issues: 3,
    active: true,
  },
  {
    id: 5,
    name: 'Ramesh Shrestha',
    email: 'ramesh@civicaid.np',
    role: 'staff',
    joined: '2025-01-15',
    issues: 0,
    active: true,
  },
  {
    id: 6,
    name: 'Admin User',
    email: 'admin@civicaid.np',
    role: 'admin',
    joined: '2024-12-01',
    issues: 0,
    active: true,
  },
  {
    id: 7,
    name: 'Deepak Rai',
    email: 'deepak@gmail.com',
    role: 'citizen',
    joined: '2025-02-20',
    issues: 12,
    active: true,
  },
  {
    id: 8,
    name: 'Anita Gurung',
    email: 'anita@hotmail.com',
    role: 'citizen',
    joined: '2025-03-01',
    issues: 1,
    active: false,
  },
  {
    id: 9,
    name: 'Suresh Pandey',
    email: 'suresh@civicaid.np',
    role: 'staff',
    joined: '2025-01-20',
    issues: 0,
    active: true,
  },
  {
    id: 10,
    name: 'Mina Tamang',
    email: 'mina@gmail.com',
    role: 'citizen',
    joined: '2025-03-05',
    issues: 4,
    active: true,
  },
  {
    id: 11,
    name: 'Rohan Basnet',
    email: 'rohan@gmail.com',
    role: 'citizen',
    joined: '2025-03-08',
    issues: 2,
    active: true,
  },
  {
    id: 12,
    name: 'Kabita Poudel',
    email: 'kabita@outlook.com',
    role: 'citizen',
    joined: '2025-03-10',
    issues: 0,
    active: false,
  },
]

// ─── Role badge ───────────────────────────────────────────────────────────────
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

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Row action menu ──────────────────────────────────────────────────────────
function ActionMenu({ user, onToggleActive, onChangeRole }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        className="p-1.5 rounded-lg text-slate-300 hover:text-slate-600
          hover:bg-slate-100 transition-colors"
      >
        <MoreVertical size={14} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-1 z-20 bg-white rounded-xl
            border border-slate-200 shadow-lg py-1 min-w-40"
          >
            {user.role !== 'admin' && (
              <>
                <button
                  onClick={() => {
                    onChangeRole(
                      user.id,
                      user.role === 'staff' ? 'citizen' : 'staff'
                    )
                    setOpen(false)
                  }}
                  className="w-full text-left text-xs px-3 py-2 hover:bg-slate-50
                    text-slate-700 font-medium transition-colors"
                >
                  {user.role === 'staff'
                    ? 'Demote to Citizen'
                    : 'Promote to Staff'}
                </button>
                <div className="h-px bg-slate-100 my-1" />
              </>
            )}
            <button
              onClick={() => {
                onToggleActive(user.id)
                setOpen(false)
              }}
              className={`w-full text-left text-xs px-3 py-2 hover:bg-slate-50
                font-medium transition-colors flex items-center gap-2
                ${user.active ? 'text-red-500' : 'text-emerald-600'}`}
            >
              {user.active ? (
                <>
                  <UserX size={11} /> Deactivate
                </>
              ) : (
                <>
                  <UserCheck size={11} /> Activate
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminUsers() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [sortKey, setSortKey] = useState('joined')
  const [sortDir, setSortDir] = useState('desc')

  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function handleToggleActive(id) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    )
  }

  function handleChangeRole(id, newRole) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    )
  }

  const processed = useMemo(() => {
    let result = [...users]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      )
    }
    if (roleFilter !== 'all')
      result = result.filter((u) => u.role === roleFilter)
    result.sort((a, b) => {
      let aVal, bVal
      if (sortKey === 'name') {
        aVal = a.name
        bVal = b.name
      }
      if (sortKey === 'joined') {
        aVal = new Date(a.joined)
        bVal = new Date(b.joined)
      }
      if (sortKey === 'issues') {
        aVal = a.issues
        bVal = b.issues
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return result
  }, [users, search, roleFilter, sortKey, sortDir])

  // Stats
  const totalCitizens = users.filter((u) => u.role === 'citizen').length
  const totalStaff = users.filter((u) => u.role === 'staff').length
  const totalActive = users.filter((u) => u.active).length

  function Th({ col, label, className = '' }) {
    return (
      <th
        onClick={() => handleSort(col)}
        className={`px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider
          text-slate-400 cursor-pointer hover:text-slate-600 select-none
          whitespace-nowrap ${className}`}
      >
        <div className="flex items-center gap-1.5">
          {label}
          <SortIcon col={col} sortKey={sortKey} sortDir={sortDir} />
        </div>
      </th>
    )
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Users
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {users.length} registered users
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Citizens', value: totalCitizens, color: 'text-slate-700' },
          { label: 'Staff', value: totalStaff, color: 'text-blue-600' },
          { label: 'Active', value: totalActive, color: 'text-emerald-600' },
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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-45 max-w-xs">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email…"
            className="w-full text-xs pl-8 pr-8 py-2 border border-slate-200 rounded-xl
              bg-white text-slate-700 placeholder:text-slate-300
              focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {['all', 'citizen', 'staff', 'admin'].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all
              ${
                roleFilter === r
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
          >
            {r === 'all' ? 'All Roles' : r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-150">
            <thead className="border-b border-slate-100 bg-slate-50/80">
              <tr>
                <th
                  className="px-4 py-3 w-10 text-[11px] font-bold uppercase
                  tracking-wider text-slate-400 text-left"
                >
                  #
                </th>
                <th col="name" label="Name" />
                <th
                  className="px-4 py-3 text-left text-[11px] font-bold uppercase
                  tracking-wider text-slate-400"
                >
                  Role
                </th>
                <th col="issues" label="Issues" className="w-20" />
                <th col="joined" label="Joined" className="w-28" />
                <th
                  className="px-4 py-3 w-24 text-left text-[11px] font-bold uppercase
                  tracking-wider text-slate-400"
                >
                  Status
                </th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {processed.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <p className="text-slate-400 text-sm">
                      No users match your search.
                    </p>
                  </td>
                </tr>
              ) : (
                processed.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-slate-300">
                        #{user.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full bg-linear-to-br
                          from-blue-400 to-violet-500 flex items-center justify-center shrink-0"
                        >
                          <span className="text-xs font-bold text-white">
                            {user.name[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-slate-600">
                        {user.issues}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-400">
                        {formatDate(user.joined)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold
                        px-2 py-0.5 rounded-full
                        ${
                          user.active
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-emerald-400' : 'bg-slate-300'}`}
                        />
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionMenu
                          user={user}
                          onToggleActive={handleToggleActive}
                          onChangeRole={handleChangeRole}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs text-slate-400">
            Showing {processed.length} of {users.length} users
            {search || roleFilter !== 'all' ? ' — filters active' : ''}
          </p>
        </div>
      </div>

      {/* Connect backend note */}
      <p className="text-xs text-slate-300 text-center mt-4">
        Demo data — connect to{' '}
        <code className="font-mono">GET /api/admin/users/</code> to load real
        users
      </p>
    </div>
  )
}
