import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  ThumbsUp,
  Bell,
  Shield,
  Map,
  Brain,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Zap,
} from 'lucide-react'

const FEATURES = [
  {
    icon: MapPin,
    title: 'Report Issues',
    description:
      'Submit civic problems with photos, GPS location, and detailed descriptions. AI classifies your report instantly.',
    // Teal — geographic, location-based action
    pill: 'bg-teal-50 border-teal-200',
    iconWrap: 'bg-teal-100',
    iconColor: 'text-teal-700',
    tag: 'text-teal-700 bg-teal-50',
  },
  {
    icon: Brain,
    title: 'AI-Powered',
    description:
      'Our AI engine automatically categorizes issues, detects duplicates, and suggests priority levels.',
    pill: 'bg-blue-50 border-blue-200',
    iconWrap: 'bg-blue-100',
    iconColor: 'text-blue-700',
    tag: 'text-blue-700 bg-blue-50',
  },
  {
    icon: Map,
    title: 'Live Issue Map',
    description:
      'See all reported civic problems plotted on an interactive map of the Kathmandu Valley.',

    pill: 'bg-sky-50 border-sky-200',
    iconWrap: 'bg-sky-100',
    iconColor: 'text-sky-700',
    tag: 'text-sky-700 bg-sky-50',
  },
  {
    icon: ThumbsUp,
    title: 'Upvote Issues',
    description:
      'Support important issues in your community. Higher upvotes signal greater urgency to authorities.',

    pill: 'bg-amber-50 border-amber-200',
    iconWrap: 'bg-amber-100',
    iconColor: 'text-amber-700',
    tag: 'text-amber-700 bg-amber-50',
  },
  {
    icon: Bell,
    title: 'Track Progress',
    description:
      'Get notified when your issue is reviewed, assigned, or resolved. Full status timeline.',

    pill: 'bg-emerald-50 border-emerald-200',
    iconWrap: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    tag: 'text-emerald-700 bg-emerald-50',
  },
  {
    icon: Shield,
    title: 'Admin Dashboard',
    description:
      'Powerful tools for authorities to manage, assign, and resolve civic issues efficiently.',

    pill: 'bg-slate-100 border-slate-200',
    iconWrap: 'bg-slate-200',
    iconColor: 'text-slate-700',
    tag: 'text-slate-700 bg-slate-100',
  },
]

const STEPS = [
  {
    step: '01',
    title: 'Report',
    description: 'Snap a photo, add a description, and drop a pin on the map.',

    bg: 'bg-teal-600',
    ring: 'ring-teal-200',
  },
  {
    step: '02',
    title: 'Review',
    description:
      'AI classifies your issue and authorities are notified immediately.',

    bg: 'bg-blue-600',
    ring: 'ring-blue-200',
  },
  {
    step: '03',
    title: 'Resolve',
    description:
      'Track status updates in real time until your issue is resolved.',

    bg: 'bg-emerald-600',
    ring: 'ring-emerald-200',
  },
]

const STATS = [
  { value: '2,400+', label: 'Issues Reported' },
  { value: '87%', label: 'Resolution Rate' },
  { value: '14', label: 'Avg. Days to Resolve' },
  { value: '12,000+', label: 'Active Citizens' },
]

const CATEGORIES = [
  {
    name: 'Road & Transport',
    emoji: '🛣️',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
  },
  {
    name: 'Water & Drainage',
    emoji: '💧',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-800',
  },
  {
    name: 'Electricity',
    emoji: '⚡',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
  },
  {
    name: 'Waste Management',
    emoji: '♻️',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
  },
  {
    name: 'Public Safety',
    emoji: '🛡️',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
  },
  {
    name: 'Parks & Green',
    emoji: '🌿',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-800',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────
function Navbar({ onLogin, onRegister }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Shield size={15} className="text-white" />
          </div>
          <span className="font-black text-slate-900 text-lg tracking-tight">
            Civic<span className="text-blue-600">Aid</span>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <a
            href="#features"
            className="text-slate-500 hover:text-slate-900 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-slate-500 hover:text-slate-900 transition-colors"
          >
            How it works
          </a>
          <a
            href="#categories"
            className="text-slate-500 hover:text-slate-900 transition-colors"
          >
            Categories
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLogin}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900
              px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Sign In
          </button>

          <button
            onClick={onRegister}
            className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700
              px-4 py-2 rounded-xl transition-colors shadow-sm shadow-blue-200"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Navbar
        onLogin={() => navigate('/login')}
        onRegister={() => navigate('/register')}
      />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-225
            bg-linear-to-b from-blue-50/60 to-transparent rounded-b-[50%]"
          />

          <div className="absolute top-32 right-0 w-72 h-72 bg-teal-50/50 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-50/40 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200
            text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider"
          >
            <Zap size={11} />
            AI-Powered Civic Platform · Nepal
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900
            tracking-tight leading-none mb-6"
          >
            Report. Track.
            <span className="block text-blue-600">Resolve.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
            CivicAid connects citizens with local authorities to fix civic
            problems faster. Report road damage, water issues, electricity
            failures and more — right from your phone.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600
                text-white font-bold px-8 py-4 rounded-2xl text-base transition-colors
                shadow-md shadow-amber-200 w-full sm:w-auto justify-center"
            >
              Report an Issue
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50
                text-slate-700 font-bold px-8 py-4 rounded-2xl text-base
                border border-slate-200 transition-colors w-full sm:w-auto justify-center"
            >
              Sign In
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-6 flex items-center justify-center gap-1.5">
            <CheckCircle size={12} className="text-emerald-500" />
            Free for citizens · Secure · Made for Nepal
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-16">
          <a
            href="#features"
            className="flex flex-col items-center gap-2 text-slate-300 hover:text-slate-400
              transition-colors animate-bounce"
          >
            <span className="text-xs font-medium">Scroll to explore</span>
            <ChevronDown size={18} />
          </a>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}

      <section className="py-12 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-black text-amber-400 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-400 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
              Everything you need
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              A complete platform for citizens, staff, and administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className={`bg-white border ${f.pill} rounded-2xl p-6
                    hover:shadow-md transition-all duration-300 group`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl ${f.iconWrap} flex items-center
                    justify-center mb-4 transition-colors`}
                  >
                    <Icon size={20} className={f.iconColor} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
              How it works
            </h2>
            <p className="text-slate-500 text-lg">
              Three simple steps from problem to resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            <div className="hidden sm:block absolute top-8 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-blue-100" />

            {STEPS.map((s) => (
              <div
                key={s.step}
                className="relative flex flex-col items-center text-center"
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center
                  text-xl font-black mb-4 shadow-lg ring-4 ${s.ring} z-10 ${s.bg} text-white`}
                >
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to Report ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
              How to Report Effectively
            </h2>
            <p className="text-slate-500 text-lg">
              The more specific your report, the faster it gets resolved.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Category */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-lg">🗂️</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-3">
                Choose the Right Category
              </h3>
              <ul className="space-y-1.5 text-sm text-slate-600">
                {[
                  ['🛣️', 'Road', 'potholes, broken footpaths, unsafe bridges'],
                  ['💧', 'Water', 'no supply, leakage, contaminated water'],
                  ['⚡', 'Electricity', 'outages, faulty poles, exposed wires'],
                  ['♻️', 'Sanitation', 'garbage, drainage, sewage overflow'],
                  [
                    '🏛️',
                    'Public Property',
                    'damaged parks, broken benches, vandalism',
                  ],
                ].map(([emoji, name, desc]) => (
                  <li key={name} className="flex items-start gap-2">
                    <span className="shrink-0">{emoji}</span>
                    <span>
                      <span className="font-semibold text-slate-800">
                        {name}
                      </span>{' '}
                      — {desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Description */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-lg">✏️</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-3">
                Describe the Problem Clearly
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                Include what is wrong and exactly where it is happening.
              </p>
              <div className="space-y-2">
                {[
                  '"Large pothole on the road near the hospital"',
                  '"Water supply unavailable for 3 days in our area"',
                  '"Exposed wires hanging from pole at the market"',
                ].map((ex) => (
                  <div
                    key={ex}
                    className="bg-white border border-blue-100 rounded-xl px-3 py-2 text-xs text-slate-500 italic"
                  >
                    {ex}
                  </div>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-lg">⚠️</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-3">
                Indicate Urgency
              </h3>
              <div className="space-y-3">
                {[
                  {
                    emoji: '🚨',
                    level: 'High Priority',
                    color: 'text-red-600 bg-red-50 border-red-200',
                    desc: 'Immediate danger — live wires, flooding, accidents, no water for days',
                  },
                  {
                    emoji: '⚠️',
                    level: 'Medium Priority',
                    color: 'text-amber-600 bg-amber-50 border-amber-200',
                    desc: 'Ongoing problems — broken roads, irregular supply, garbage buildup',
                  },
                  {
                    emoji: '🟢',
                    level: 'Low Priority',
                    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
                    desc: 'Minor issues — faded paint, small cracks, minor damage',
                  },
                ].map((p) => (
                  <div
                    key={p.level}
                    className={`border rounded-xl px-3 py-2.5 ${p.color}`}
                  >
                    <p className="text-xs font-bold mb-0.5">
                      {p.emoji} {p.level}
                    </p>
                    <p className="text-xs opacity-80">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Supporting details */}
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-lg">📋</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-3">
                Add Supporting Details
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                {[
                  [
                    '📸',
                    'Upload a photo',
                    'Visual proof helps authorities act faster',
                  ],
                  [
                    '📍',
                    'Share your location',
                    'Pinpoint accuracy speeds up response',
                  ],
                  ['🕐', 'Mention duration', 'How long has the issue existed?'],
                ].map(([emoji, title, desc]) => (
                  <li key={title} className="flex items-start gap-3">
                    <span className="text-base shrink-0">{emoji}</span>
                    <div>
                      <p className="font-semibold text-slate-800">{title}</p>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Tip */}
              <div className="mt-5 bg-teal-100 border border-teal-200 rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-teal-800 mb-0.5">💡 Tip</p>
                <p className="text-xs text-teal-700">
                  The more specific your description, the faster and more
                  accurately your issue can be resolved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────────────────────── */}
      <section id="categories" className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
              Issue Categories
            </h2>
            <p className="text-slate-500 text-lg">
              Report problems across all civic departments.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className={`${cat.bg} border ${cat.border} rounded-2xl p-5
                  flex items-center gap-3 hover:scale-[1.03] transition-transform cursor-default`}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className={`text-sm font-bold leading-tight ${cat.text}`}>
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}

      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to make your community better?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of citizens already using CivicAid to improve Nepal.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500
                text-amber-950 font-bold px-8 py-4 rounded-2xl text-base
                transition-colors w-full sm:w-auto justify-center shadow-lg"
            >
              Create Free Account
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20
                text-white font-bold px-8 py-4 rounded-2xl text-base
                border border-white/30 transition-colors w-full sm:w-auto justify-center"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="py-10 px-4 bg-slate-900">
        <div
          className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center
          justify-between gap-4"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield size={13} className="text-white" />
            </div>

            <span className="font-black text-white">
              Civic<span className="text-blue-400">Aid</span>
            </span>
          </div>
          <p className="text-sm text-slate-500">
            © 2026 CivicAid Nepal. Built for citizens, by citizens.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <button
              onClick={() => navigate('/login')}
              className="hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="hover:text-white transition-colors"
            >
              Register
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
