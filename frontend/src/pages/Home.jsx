import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  ThumbsUp,
  Bell,
  Map,
  Plus,
  ChevronRight,
  ClipboardList,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import useAuth from '../hooks/useAuth'

const QUICK_ACTIONS = [
  {
    icon: Plus,
    label: 'Report an Issue',
    description: 'Submit a new civic problem',
    path: '/submit',
    card: 'bg-amber-500 hover:bg-amber-600',
    textColor: 'text-amber-950',
    subColor: 'text-amber-800',
    iconWrap: 'bg-amber-400/40',
    iconColor: 'text-amber-950',
    chevron: 'text-amber-900',
  },
  {
    icon: ClipboardList,
    label: 'My Issues',
    description: 'View your submitted reports',
    path: '/issues',
    card: 'bg-white hover:bg-slate-50 border border-slate-200',
    textColor: 'text-slate-900',
    subColor: 'text-slate-400',
    iconWrap: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    chevron: 'text-slate-400',
  },
  {
    icon: Map,
    label: 'Issue Map',
    description: 'See all issues near you',
    path: '/map',
    card: 'bg-white hover:bg-slate-50 border border-slate-200',
    textColor: 'text-slate-900',
    subColor: 'text-slate-400',
    iconWrap: 'bg-teal-50',
    iconColor: 'text-teal-600',
    chevron: 'text-slate-400',
  },
]

const FEATURES = [
  {
    icon: MapPin,
    title: 'Report Issues',
    description:
      'Submit road damage, water problems, electricity failures and more with a photo and GPS location.',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    icon: ThumbsUp,
    title: 'Upvote & Support',
    description:
      'Upvote issues in your community to signal urgency to local authorities.',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: Bell,
    title: 'Track Progress',
    description:
      'Get notified when your issue is reviewed, assigned to staff, or resolved.',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
  {
    icon: CheckCircle2,
    title: 'See Resolutions',
    description:
      'Follow the full status timeline from submission to resolution for every issue.',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
]

const STATUSES = [
  {
    status: 'Reported',
    dot: 'bg-indigo-500',
    badge: 'bg-indigo-50 text-indigo-700',
    desc: 'Your issue has been submitted and is waiting for review.',
  },
  {
    status: 'In Progress',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-800',
    desc: 'A staff member has been assigned and is working on it.',
  },
  {
    status: 'Resolved',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700',
    desc: 'The issue has been fixed by the responsible authority.',
  },
  {
    status: 'Closed',
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600',
    desc: 'Issue has been closed after resolution or review.',
  },
]

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const firstName = user?.name?.split(' ')[0] ?? 'there'
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        {/* ── Welcome header ─────────────────────────────────────────────── */}
        <div className="bg-[#0f172a] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_70%)]" />
            <div className="absolute -bottom-10 left-10 w-40 h-40 bg-[radial-gradient(circle,rgba(67,56,202,0.1)_0%,transparent_70%)]" />
          </div>
          {/* Amber accent dot */}
          <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-amber-400 opacity-80" />

          <div className="relative">
            {/* Avatar */}
            <div
              className="w-12 h-12 rounded-[10px_3px_10px_3px] bg-indigo-700 border border-indigo-500/40
              flex items-center justify-center text-xl font-black mb-5 text-white"
            >
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>

            <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.15em] mb-1">
              {greeting} 👋
            </p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
              Welcome back, {firstName}!
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              You're logged in as a{' '}
              <span className="font-black capitalize text-white bg-white/10 border border-white/10 px-2 py-0.5 rounded-md">
                {user?.role}
              </span>
              . Help improve your community by reporting civic issues and
              tracking their resolution.
            </p>
          </div>
        </div>

        {/* ── Quick actions ───────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block w-4 h-0.5 bg-amber-400 rounded" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  className={`${action.card} rounded-2xl p-4 text-left
                    transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                    flex items-center gap-3 group`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center
                    shrink-0 ${action.iconWrap}`}
                  >
                    <Icon size={18} className={action.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-black tracking-tight ${action.textColor}`}
                    >
                      {action.label}
                    </p>
                    <p
                      className={`text-xs mt-0.5 font-medium ${action.subColor}`}
                    >
                      {action.description}
                    </p>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`shrink-0 opacity-50 group-hover:opacity-100
                      group-hover:translate-x-0.5 transition-all ${action.chevron}`}
                  />
                </button>
              )
            })}
          </div>
        </div>

        {/* ── What you can do ─────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block w-4 h-0.5 bg-amber-400 rounded" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              What You Can Do
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="bg-white rounded-2xl border border-slate-200 p-5
                    flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5
                    transition-all duration-200"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${f.iconBg} flex items-center
                    justify-center shrink-0 mt-0.5`}
                  >
                    <Icon size={18} className={f.iconColor} />
                  </div>
                  <div>
                    <p className="text-sm font-black tracking-tight text-slate-900 mb-1">
                      {f.title}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Status guide ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-4 h-0.5 bg-amber-400 rounded" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Issue Status Guide
            </h2>
          </div>
          <div className="space-y-3">
            {STATUSES.map((item) => (
              <div key={item.status} className="flex items-start gap-3">
                <span
                  className={`w-2 h-2 rounded-full ${item.dot} mt-1.5 shrink-0`}
                />
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-md tracking-tight ${item.badge}`}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs text-slate-500">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Pro tip ─────────────────────────────────────────────────────── */}
        <div className="flex items-start gap-3 bg-[#0f172a] border border-slate-800 rounded-2xl p-4">
          <div
            className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/20
            flex items-center justify-center shrink-0 mt-0.5"
          >
            <Clock size={14} className="text-amber-400" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="font-black text-amber-400">Pro tip:</span> The more
            detail you add when reporting — photos, GPS location, and a clear
            description — the faster your issue gets resolved.
          </p>
        </div>
      </div>
    </div>
  )
}
