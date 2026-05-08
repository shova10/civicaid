import { Link, useNavigate } from 'react-router-dom'
import {
  MapPin,
  ThumbsUp,
  Bell,
  Shield,
  Map,
  Brain,
  ArrowRight,
} from 'lucide-react'


const FEATURES = [
  {
    icon: MapPin,
    title: 'Report Issues',
    description:
      'Submit civic problems with photos, GPS location, and detailed descriptions. AI classifies your report instantly.',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-700',
  },
  {
    icon: Brain,
    title: 'AI-Powered',
    description:
      'Our AI engine automatically categorizes issues, detects duplicates, and suggests priority levels.',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
  },
  {
    icon: Map,
    title: 'Live Issue Map',
    description:
      'See all reported civic problems plotted on an interactive map of the Nepal.',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-700',
  },
  {
    icon: ThumbsUp,
    title: 'Upvote Issues',
    description:
      'Support important issues in your community. Higher upvotes signal greater urgency to authorities.',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
  },
  {
    icon: Bell,
    title: 'Track Progress',
    description:
      'Get notified when your issue is reviewed, assigned, or resolved. Full status timeline.',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
  },
  {
    icon: Shield,
    title: 'Admin Dashboard',
    description:
      'Powerful tools for authorities to manage, assign, and resolve civic issues efficiently.',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
  },
]


const STEPS = [
  {
    step: '01',
    title: 'Report',
    description: 'Snap a photo, add a description, and drop a pin on the map.',
    bg: 'bg-teal-700',
    ring: 'ring-teal-900',
  },
  {
    step: '02',
    title: 'Review',
    description:
      'AI classifies your issue and authorities are notified immediately.',
    bg: 'bg-blue-700',
    ring: 'ring-blue-900',
  },
  {
    step: '03',
    title: 'Resolve',
    description:
      'Track status updates in real time until your issue is resolved.',
    bg: 'bg-emerald-700',
    ring: 'ring-emerald-900',
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


// ─── Shared Section Header ────────────────────────────────────────────────────
function SectionHeader({ label, title, sub, light = false }) {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <div
        className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-3 ${
          light ? 'text-indigo-300' : 'text-indigo-700'
        }`}
      >
        <span className="inline-block w-5 h-0.5 bg-amber-400 rounded" />
        {label}
      </div>
      <h2
        className={`text-3xl sm:text-4xl font-black tracking-tight mb-3 ${
          light ? 'text-slate-100' : 'text-slate-900'
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`text-base font-medium ${light ? 'text-slate-500' : 'text-slate-500'}`}
        >
          {sub}
        </p>
      )}
    </div>
  )
}


// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ onLogin, onRegister }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fafaf9]/95 backdrop-blur-lg border-b border-slate-200/50">
      <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px_3px_10px_3px] bg-indigo-700 flex items-center justify-center shadow-sm">
            <Shield size={15} className="text-white" />
          </div>
          <a
            href="#"
            className="text-[22px] font-black tracking-tight text-slate-900 no-underline"
          >
            Civic<span className="text-indigo-700">Aid</span>
          </a>
        </div>


        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How it works', 'Categories'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 hover:text-indigo-700 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>


        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLogin}
            className="hidden sm:block text-xs font-bold text-slate-500 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100 transition-all"
          >
            Sign in
          </button>
          <button
            onClick={onRegister}
            className="text-xs font-bold text-amber-900 bg-amber-500 hover:bg-amber-600 px-5 py-2.5 rounded-full transition-all shadow-sm"
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  )
}


// ─── Main Landing ─────────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate()


  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <Navbar
        onLogin={() => navigate('/login')}
        onRegister={() => navigate('/register')}
      />


      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 overflow-hidden bg-[#fafaf9]">
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)]" />
        </div>


        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-full mb-7 uppercase tracking-[0.18em]">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Direct Civic Action • Nepal
          </div>


          {/* Heading */}
          <h1 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tight leading-[1.08] mb-6">
            Building a better <br />
            <span className="text-indigo-700 relative inline-block">
              community, together.
              <span className="absolute left-0 -bottom-1 w-full h-0.75 bg-amber-400 rounded opacity-70" />
            </span>
          </h1>


          <p className="text-base sm:text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed mb-10">
            CivicAid is your direct line to local authorities. From potholes to
            power lines, report issues in seconds and watch your neighborhood
            transform.
          </p>


          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="group inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600
                text-amber-950 font-bold px-10 py-4 rounded-full text-base
                transition-all shadow-lg shadow-amber-100 w-full sm:w-auto justify-center"
            >
              Report an Issue
              <ArrowRight
                size={17}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>


            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 bg-transparent hover:bg-slate-100
                text-slate-900 font-bold px-10 py-4 rounded-xl text-base
                border-2 border-slate-200 transition-colors w-full sm:w-auto justify-center"
            >
              Sign In
            </button>
          </div>
        </div>


        {/* Scroll hint */}
        <div className="flex justify-center mt-16">
          <a
            href="#features"
            className="group flex flex-col items-center gap-3"
          >
            <div className="w-px h-11 bg-linear-to-b from-slate-200 to-indigo-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-indigo-500 animate-[scrollDown_2s_ease-in-out_infinite]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-indigo-500 transition-colors">
              Discover
            </span>
          </a>
        </div>
      </section>


      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#0f172a] relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-700 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-700 to-transparent" />


        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-0">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className="relative group px-8 border-r border-slate-800 last:border-r-0 first:pl-0"
              >
                <span className="absolute -top-3 left-2 text-[52px] font-black text-white/3 select-none leading-none">
                  0{index + 1}
                </span>
                <p className="text-[42px] font-black text-amber-400 tracking-tight leading-none mb-2.5">
                  {stat.value}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-0.75 h-4 bg-indigo-500 rounded-full shrink-0" />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
                    {stat.label}
                  </p>
                </div>
                <div className="mt-4 h-0.5 w-9 bg-slate-800 rounded group-hover:w-14 group-hover:bg-amber-400 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 bg-white">
        <SectionHeader
          label="Platform"
          title="Everything you need"
          sub="A complete platform for citizens, staff, and administrators."
        />


        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="bg-slate-50 border border-slate-200/70 rounded-2xl p-6
                  hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${f.iconBg} flex items-center justify-center mb-4`}
                >
                  <Icon size={18} className={f.iconColor} />
                </div>
                <h3 className="text-[15px] font-black text-slate-900 tracking-tight mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {f.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>


      {/* ── How it Works ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 bg-[#0f172a]">
        <SectionHeader
          label="Process"
          title="How it works"
          sub="Three simple steps from problem to resolution."
          light
        />


        <div className="max-w-3xl mx-auto mt-14 grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
          <div className="hidden sm:block absolute top-8 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-slate-800" />
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="flex flex-col items-center text-center"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center
                  text-xl font-black mb-5 ring-4 ${s.ring} z-10 ${s.bg} text-white`}
              >
                {s.step}
              </div>
              <h3 className="text-base font-black text-slate-100 mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>


      {/* ── How to Report ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-slate-50">
        <SectionHeader
          label="Tips"
          title="How to Report Effectively"
          sub="The more specific your report, the faster it gets resolved."
        />


        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-4 text-lg">
              🗂️
            </div>
            <h3 className="text-[15px] font-black text-slate-900 tracking-tight mb-3">
              Choose the Right Category
            </h3>
            <ul className="space-y-1.5 text-sm text-slate-500">
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
                    <span className="font-bold text-slate-700">{name}</span> —{' '}
                    {desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>


          {/* Description */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-lg">
              ✏️
            </div>
            <h3 className="text-[15px] font-black text-slate-900 tracking-tight mb-3">
              Describe the Problem Clearly
            </h3>
            <p className="text-sm text-slate-500 mb-3">
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
                  className="bg-white border border-blue-100 rounded-xl px-3 py-2 text-xs text-slate-500"
                >
                  {ex}
                </div>
              ))}
            </div>
          </div>


          {/* Priority */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-4 text-lg">
              ⚠️
            </div>
            <h3 className="text-[15px] font-black text-slate-900 tracking-tight mb-3">
              Indicate Urgency
            </h3>
            <div className="space-y-3">
              {[
                {
                  emoji: '🚨',
                  level: 'High Priority',
                  color: 'text-red-700 bg-red-50 border-red-200',
                  desc: 'Immediate danger — live wires, flooding, accidents, no water for days',
                },
                {
                  emoji: '⚠️',
                  level: 'Medium Priority',
                  color: 'text-amber-700 bg-amber-50 border-amber-200',
                  desc: 'Ongoing problems — broken roads, irregular supply, garbage buildup',
                },
                {
                  emoji: '🟢',
                  level: 'Low Priority',
                  color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
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
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center mb-4 text-lg">
              📋
            </div>
            <h3 className="text-[15px] font-black text-slate-900 tracking-tight mb-3">
              Add Supporting Details
            </h3>
            <ul className="space-y-3 text-sm text-slate-500">
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
                    <p className="font-bold text-slate-700">{title}</p>
                    <p className="text-xs text-slate-400">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 bg-teal-100 border border-teal-200 rounded-xl px-4 py-3">
              <p className="text-xs font-bold text-teal-800 mb-0.5">💡 Tip</p>
              <p className="text-xs text-teal-700">
                The more specific your description, the faster and more
                accurately your issue can be resolved.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ── Categories ────────────────────────────────────────────────────── */}
      <section id="categories" className="py-20 px-4 bg-white">
        <SectionHeader
          label="Departments"
          title="Issue Categories"
          sub="Report problems across all civic departments."
        />


        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className={`${cat.bg} border ${cat.border} rounded-2xl p-5
                flex items-center gap-3 hover:scale-[1.02] transition-transform cursor-default`}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span
                className={`text-sm font-black leading-tight tracking-tight ${cat.text}`}
              >
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>


      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[#0f172a] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-150 h-150 bg-[radial-gradient(ellipse_at_center,rgba(67,56,202,0.15)_0%,transparent_70%)]" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight mb-4">
            Ready to make your community better?
          </h2>
          <p className="text-slate-500 text-base font-medium mb-10">
            Join thousands of citizens already using CivicAid to improve Nepal.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="group inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600
                text-amber-950 font-bold px-10 py-4 rounded-full text-base
                transition-all shadow-lg w-full sm:w-auto justify-center"
            >
              Create An Account
              <ArrowRight
                size={17}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 bg-white/[0.07] hover:bg-white/12
                text-slate-100 font-bold px-10 py-4 rounded-full text-base
                border border-white/20 transition-colors w-full sm:w-auto justify-center"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>


      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="py-8 px-4 bg-[#020617]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-700 flex items-center justify-center">
              <Shield size={13} className="text-white" />
            </div>
            <span className="font-black text-slate-100 text-base">
              Civic<span className="text-indigo-400">Aid</span>
            </span>
          </div>
          <p className="text-xs text-slate-600">
            © 2026 CivicAid Nepal. Built for citizens, by Binita & Shova.
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-600">
            <button
              onClick={() => navigate('/login')}
              className="hover:text-slate-200 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="hover:text-slate-200 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}



