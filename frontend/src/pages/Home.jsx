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
import Avatar from '../components/Avatar'
import useAuth from '../hooks/useAuth'

const QUICK_ACTIONS = [
  {
    icon: Plus,
    label: 'Report an Issue',
    description: 'Submit a new civic problem',
    path: '/submit',
    card: 'bg-amber-500 hover:bg-amber-600',
    textColor: 'text-[#1C1A17]',
    subColor: 'text-[#1C1A17]/70',
    iconWrap: 'bg-[#FFF3D6]',
    iconColor: 'text-[#1C1A17]',
    chevron: 'text-[#1C1A17]/60',
  },
  {
    icon: ClipboardList,
    label: 'My Issues',
    description: 'View your submitted reports',
    path: '/issues',
    card: 'bg-[#FFFBF5] border border-[#E7DDCF] hover:shadow-md',
    textColor: 'text-[#1C1A17]',
    subColor: 'text-[#6B665E]',
    iconWrap: 'bg-indigo-50',
    iconColor: 'text-indigo-700',
    chevron: 'text-[#6B665E]',
  },
  {
    icon: Map,
    label: 'Map View',
    description: 'See all issues near you',
    path: '/map',
    card: 'bg-[#FFFBF5] border border-[#E7DDCF] hover:shadow-md',
    textColor: 'text-[#1C1A17]',
    subColor: 'text-[#6B665E]',
    iconWrap: 'bg-sky-50',
    iconColor: 'text-sky-700',
    chevron: 'text-[#6B665E]',
  },
]

const FEATURES = [
  {
    icon: MapPin,
    title: 'Report Issues',
    description:
      'Submit civic problems with photo and location for faster action.',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-700',
  },
  {
    icon: ThumbsUp,
    title: 'Upvote & Support',
    description: 'Help prioritize issues that matter in your community.',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-700',
  },
  {
    icon: Bell,
    title: 'Track Progress',
    description: 'Get updates when your issue status changes.',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-700',
  },
  {
    icon: CheckCircle2,
    title: 'Resolutions',
    description: 'See full lifecycle from report to completion.',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-700',
  },
]

const STATUSES = [
  {
    status: 'Reported',
    dot: 'bg-indigo-500',
    badge: 'bg-indigo-50 text-indigo-700',
    desc: 'Waiting for review.',
  },
  {
    status: 'In Progress',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-800',
    desc: 'Being worked on.',
  },
  {
    status: 'Resolved',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700',
    desc: 'Successfully fixed.',
  },
  {
    status: 'Closed',
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600',
    desc: 'Closed after review.',
  },
]

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleMapNavigate = () => {
    if (!navigator.geolocation) return navigate('/map')

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        navigate('/map', {
          state: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        }),
      () => navigate('/map')
    )
  }

  const firstName =
    (user?.citizen_name || user?.full_name || user?.name)?.split(' ')[0] ??
    'there'

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen bg-[#F6F1E8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Hero */}
        <div className="relative bg-[#FFFBF5] border border-[#E7DDCF] rounded-3xl p-6 sm:p-8 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[radial-gradient(circle,rgba(192,132,87,0.10)_0%,transparent_70%)]" />

          <Avatar
            userId={user?.id}
            name={user?.citizen_name || user?.full_name || user?.name}
            size="md"
            className="mb-4"
          />

          <p className="text-[#6B665E] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
            {greeting}
          </p>

          <h1 className="text-2xl sm:text-3xl font-black text-[#1C1A17] mb-2">
            Welcome back, {firstName}
          </h1>

          <p className="text-[#6B665E] text-sm max-w-md leading-relaxed">
            Report issues and help improve your community.
          </p>
        </div>

        {/* Quick Actions */}
        <section>
          <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#6B665E] font-bold">
            Quick Actions
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {QUICK_ACTIONS.map((a) => {
              const Icon = a.icon

              return (
                <button
                  key={a.path}
                  onClick={() =>
                    a.path === '/map' ? handleMapNavigate() : navigate(a.path)
                  }
                  className={`${a.card} rounded-3xl p-4 sm:p-5 flex items-center gap-3 transition-all hover:-translate-y-0.5 text-left w-full`}
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${a.iconWrap}`}
                  >
                    <Icon size={18} className={a.iconColor} />
                  </div>

                  <div className="flex-1">
                    <p className={`text-sm font-black ${a.textColor}`}>
                      {a.label}
                    </p>
                    <p className={`text-[11px] ${a.subColor}`}>
                      {a.description}
                    </p>
                  </div>

                  <ChevronRight size={16} className={`${a.chevron}`} />
                </button>
              )
            })}
          </div>
        </section>

        {/* Features */}
        <section>
          <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#6B665E] font-bold">
            What You Can Do
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURES.map((f) => {
              const Icon = f.icon

              return (
                <div
                  key={f.title}
                  className="bg-[#FFFBF5] border border-[#E7DDCF] rounded-3xl p-5 sm:p-6 flex gap-4 hover:-translate-y-0.5 transition-all"
                >
                  <div
                    className={`w-10 h-10 rounded-2xl ${f.iconBg} flex items-center justify-center`}
                  >
                    <Icon size={18} className={f.iconColor} />
                  </div>

                  <div>
                    <p className="font-black text-[#1C1A17] text-sm mb-1">
                      {f.title}
                    </p>
                    <p className="text-[12px] text-[#6B665E]">
                      {f.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Status Guide */}
        <section className="bg-[#FFFBF5] border border-[#E7DDCF] rounded-3xl p-5 sm:p-6">
          <p className="mb-4 text-[10px] uppercase tracking-[0.15em] text-[#6B665E] font-bold">
            Status Guide
          </p>

          <div className="space-y-3">
            {STATUSES.map((s) => (
              <div key={s.status} className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${s.dot}`} />

                <span
                  className={`text-xs px-2.5 py-1 rounded-lg font-black ${s.badge}`}
                >
                  {s.status}
                </span>

                <span className="text-xs text-[#6B665E]">{s.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tip */}
        <div className="bg-[#1C1A17] rounded-3xl p-4 sm:p-5 flex gap-3">
          <Clock size={14} className="text-amber-400 mt-0.5" />
          <p className="text-xs text-[#A8A29E]">
            <span className="text-amber-400 font-black">Pro tip:</span> Add
            photos and precise location for faster resolution.
          </p>
        </div>
      </div>
    </div>
  )
}
