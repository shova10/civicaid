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
    textColor: 'text-white',
    subColor: 'text-amber-100',
    iconWrap: 'bg-amber-400/40',
    iconColor: 'text-white',
    chevron: 'text-white',
  },
  {
    icon: ClipboardList,
    label: 'My Issues',
    description: 'View your submitted reports',
    path: '/issues',
    card: 'bg-white hover:bg-blue-50 border border-slate-200',
    textColor: 'text-slate-800',
    subColor: 'text-slate-400',
    iconWrap: 'bg-blue-50',
    iconColor: 'text-blue-600',
    chevron: 'text-slate-400',
  },
  {
    icon: Map,
    label: 'Issue Map',
    description: 'See all issues near you',
    path: '/map',
    card: 'bg-white hover:bg-teal-50 border border-slate-200',
    textColor: 'text-slate-800',
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
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    iconColor: 'text-teal-600',
  },
  {
    icon: ThumbsUp,
    title: 'Upvote & Support',
    description:
      'Upvote issues in your community to signal urgency to local authorities.',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    icon: Bell,
    title: 'Track Progress',
    description:
      'Get notified when your issue is reviewed, assigned to staff, or resolved.',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    iconColor: 'text-sky-600',
  },
  {
    icon: CheckCircle2,
    title: 'See Resolutions',
    description:
      'Follow the full status timeline from submission to resolution for every issue.',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconColor: 'text-emerald-600',
  },
]


const STATUSES = [
  {
    status: 'Reported',
    dot: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700',
    desc: 'Your issue has been submitted and is waiting for review.',
  },
  {
    status: 'In Progress',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700',
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
        
        <div className="bg-blue-600 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/30 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-16 w-28 h-28 bg-blue-700/40 rounded-full translate-y-1/2 pointer-events-none" />
          
          <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-amber-400 opacity-80" />

          <div className="relative">
            
            <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30
              flex items-center justify-center text-xl font-black mb-4">
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>

            <p className="text-blue-200 text-sm font-medium mb-1">{greeting} 👋</p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
              Welcome back, {firstName}!
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed max-w-md">
              You're logged in as a{' '}
              <span className="font-bold capitalize text-white bg-white/15 px-1.5 py-0.5 rounded-md">
                {user?.role}
              </span>
              . Help improve your community by reporting civic issues and tracking their resolution.
            </p>
          </div>
        </div>

        {/* ── Quick actions ───────────────────────────────────────────────── */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Quick Actions
          </h2>
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
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                    shrink-0 ${action.iconWrap}`}>
                    <Icon size={18} className={action.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${action.textColor}`}>{action.label}</p>
                    <p className={`text-xs mt-0.5 ${action.subColor}`}>{action.description}</p>
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            What You Can Do
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className={`bg-white rounded-2xl border ${f.border} shadow-sm p-5
                    flex items-start gap-4 hover:shadow-md transition-shadow duration-200`}
                >
                  <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center
                    justify-center shrink-0 mt-0.5`}>
                    <Icon size={18} className={f.iconColor} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 mb-1">{f.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{f.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Status guide ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Issue Status Guide
          </h2>
          <div className="space-y-3">
            {STATUSES.map((item) => (
              <div key={item.status} className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full ${item.dot} mt-1.5 shrink-0`} />
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${item.badge}`}>
                    {item.status}
                  </span>
                  <span className="text-xs text-slate-500">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
            <Clock size={14} className="text-amber-600" />
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong className="font-bold">Pro tip:</strong> The more detail you add when reporting —
            photos, GPS location, and a clear description — the faster your issue gets resolved.
          </p>
        </div>

      </div>
    </div>
  )
}