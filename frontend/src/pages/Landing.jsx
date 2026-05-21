import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  MapPin,
  ThumbsUp,
  Bell,
  Shield,
  Map,
  Brain,
  ArrowRight,
  Menu,
  X,
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
      'See all reported civic problems plotted on an interactive map of Nepal.',
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

// ─── Smooth scroll helper ─────────────────────────────────────────────────────
function scrollTo(id) {
  if (!id) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ label, title, sub, light = false }) {
  return (
    <div className="text-center max-w-4xl mx-auto px-4">
      <div
        className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-3 ${
          light ? 'text-indigo-300' : 'text-indigo-700'
        }`}
      >
        <span className="inline-block w-5 h-0.5 bg-amber-400 rounded" />
        {label}
      </div>
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-3 ${
          light ? 'text-slate-100' : 'text-slate-900'
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`text-sm sm:text-base font-medium ${light ? 'text-slate-400' : 'text-slate-500'}`}
        >
          {sub}
        </p>
      )}
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'How it works', id: 'how-it-works' },
    { label: 'Categories', id: 'categories' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F6F1E8]/90 backdrop-blur border-b border-[#E7DDCF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => scrollTo(null)}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px_3px_10px_3px] bg-indigo-700 flex items-center justify-center shrink-0">
            <Shield size={14} className="text-white" />
          </div>

          <span className="text-lg sm:text-[22px] font-black tracking-tight text-[#1C1A17]">
            Civic<span className="text-indigo-700">Aid</span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-[11px] font-bold uppercase tracking-[0.15em]
          text-[#6B665E] hover:text-[#1C1A17] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-xs font-bold text-[#6B665E]
        hover:text-[#1C1A17]
        px-4 py-2 rounded-full
        hover:bg-[#EFE6DA]
        transition-all"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="text-xs font-bold text-[#1C1A17]
        bg-amber-500 hover:bg-amber-600
        px-5 py-2.5 rounded-full
        transition-all shadow-sm"
          >
            Sign Up
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/register"
            className="text-xs font-bold text-[#1C1A17]
        bg-amber-500 hover:bg-amber-600
        px-4 py-2 rounded-full
        transition-all shadow-sm"
          >
            Sign Up
          </Link>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 rounded-full
        text-[#6B665E]
        hover:text-[#1C1A17]
        hover:bg-[#EFE6DA]
        transition-all"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden bg-[#F6F1E8]
      border-t border-[#E7DDCF]
      px-4 py-4 flex flex-col gap-3"
        >
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                scrollTo(item.id)
                setMobileOpen(false)
              }}
              className="text-left text-sm font-bold uppercase tracking-[0.12em]
          text-[#6B665E]
          hover:text-[#1C1A17]
          py-2 transition-colors"
            >
              {item.label}
            </button>
          ))}

          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="text-sm font-bold text-[#5B5A56]
        hover:text-[#1C1A17]
        py-2 transition-colors"
          >
            Sign In
          </Link>
        </div>
      )}
    </nav>
  )
}

// ─── Main Landing ─────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-900 font-sans">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden bg-[#F6F1E8]">
        {/* Soft radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[28rem]
      bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.06)_0%,transparent_72%)]"
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 bg-[#FFFBF5]
      border border-[#E7DDCF] text-[#6B665E]
      text-[10px] font-bold px-3.5 py-1.5 rounded-full mb-7
      uppercase tracking-[0.18em] shadow-sm"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Direct Civic Action • Nepal
          </div>

          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl
      font-black text-[#1C1A17]
      tracking-tight leading-[1.05] mb-6"
          >
            Building a better <br className="hidden sm:block" />
            <span className="relative inline-block text-indigo-700">
              community, together.
              <span
                className="absolute left-0 -bottom-1.5 w-full h-[3px]
          bg-amber-400/70 rounded-full"
              />
            </span>
          </h1>

          <p
            className="text-sm sm:text-base lg:text-lg
      text-[#5B5A56] font-medium
      max-w-2xl mx-auto leading-relaxed mb-9 sm:mb-10"
          >
            CivicAid helps citizens report local problems directly to
            authorities — from potholes and drainage issues to damaged power
            lines and public safety concerns.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2
        bg-amber-500 hover:bg-amber-600
        text-[#1C1A17] font-bold
        px-8 sm:px-10 py-3.5 sm:py-4
        rounded-full text-sm sm:text-base
        transition-all duration-200
        shadow-sm hover:shadow-md
        w-full sm:w-auto justify-center"
            >
              Report an Issue
              <ArrowRight
                size={17}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2
        bg-[#FFFBF5] hover:bg-[#FFF7ED]
        text-[#1C1A17] font-bold
        px-8 sm:px-10 py-3.5 sm:py-4
        rounded-full text-sm sm:text-base
        border border-[#E7DDCF]
        transition-colors
        w-full sm:w-auto justify-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-18 bg-[#EFE6DA] border-y border-[#E7DDCF]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 sm:gap-y-12">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={`relative px-4 sm:px-6 ${
                  index !== STATS.length - 1
                    ? 'lg:border-r lg:border-[#DDD2C3]'
                    : ''
                }`}
              >
                <span
                  className="absolute -top-4 left-2
            text-[42px] sm:text-[56px]
            font-black text-[#D8CCBC]
            select-none leading-none"
                >
                  0{index + 1}
                </span>

                <p
                  className="relative text-3xl sm:text-[42px]
            font-black text-[#B7791F]
            tracking-tight leading-none mb-2"
                >
                  {stat.value}
                </p>

                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-4 bg-indigo-600 rounded-full shrink-0" />

                  <p
                    className="text-[10px]
              uppercase tracking-[0.18em]
              text-[#6B665E]
              font-bold leading-tight"
                  >
                    {stat.label}
                  </p>
                </div>

                <div
                  className="mt-4 h-0.5 w-8
            bg-[#D8CCBC]
            rounded-full
            group-hover:w-12
            group-hover:bg-amber-500
            transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 sm:py-24 px-4 bg-[#F6F1E8]">
        <SectionHeader
          label="Platform"
          title="Everything you need"
          sub="A complete platform for citizens, staff, and administrators."
        />

        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon

            return (
              <div
                key={f.title}
                className="
            group
            bg-[#FFFDF9]
            border border-[#E7DED1]
            rounded-3xl
            p-6 sm:p-7
            shadow-[0_2px_10px_rgba(15,23,42,0.03)]
            hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)]
            hover:-translate-y-1
            transition-all duration-300
          "
              >
                <div
                  className={`
              w-12 h-12 rounded-2xl
              ${f.iconBg}
              flex items-center justify-center
              mb-5
            `}
                >
                  <Icon size={20} className={f.iconColor} />
                </div>

                <h3 className="text-lg font-extrabold text-[#1F2937] tracking-tight mb-3">
                  {f.title}
                </h3>

                <p className="text-[15px] leading-7 text-[#6B7280]">
                  {f.description}
                </p>

                <div
                  className="
              mt-6
              h-[2px]
              w-10
              bg-[#D6C2A8]
              rounded-full
              transition-all duration-300
              group-hover:w-16
              group-hover:bg-[#C08457]
            "
                />
              </div>
            )
          })}
        </div>
      </section>

      {/* ── How it Works ──────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-20 sm:py-24 px-4 bg-[#1E1B18] relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[radial-gradient(circle,rgba(192,132,87,0.08)_0%,transparent_70%)]" />
        </div>

        <SectionHeader
          label="Process"
          title="How it works"
          sub="Three simple steps from problem to resolution."
          light
        />

        <div className="relative max-w-5xl mx-auto mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="hidden sm:block absolute top-10 left-[18%] right-[18%] h-px bg-[#3A342D]" />

          {STEPS.map((s) => (
            <div
              key={s.step}
              className="
          relative z-10
          bg-[#26221E]
          border border-[#3A342D]
          rounded-3xl
          p-7
          text-center
          transition-all duration-300
          hover:-translate-y-1
          hover:border-[#C08457]/40
          hover:shadow-[0_10px_30px_rgba(0,0,0,0.18)]
        "
            >
              <div
                className={`
            mx-auto
            w-16 h-16
            rounded-2xl
            flex items-center justify-center
            text-lg font-black
            mb-5
            ring-4
            ${s.ring}
            ${s.bg}
            text-white
          `}
              >
                {s.step}
              </div>

              <h3 className="text-lg font-extrabold text-[#F8F4EE] mb-3 tracking-tight">
                {s.title}
              </h3>

              <p className="text-sm leading-7 text-[#A8A29E]">
                {s.description}
              </p>

              <div className="mt-6 w-10 h-[2px] mx-auto rounded-full bg-[#C08457]" />
            </div>
          ))}
        </div>
      </section>

      {/* ── How to Report ─────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 px-4 bg-[#F6F1E8]">
        <SectionHeader
          label="Tips"
          title="How to Report Effectively"
          sub="The more specific your report, the faster it gets resolved."
        />

        <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[#FFFDF9] border border-[#E7DED1] rounded-3xl p-6 sm:p-7">
            <div className="w-11 h-11 bg-[#F3E7D3] rounded-2xl flex items-center justify-center mb-5 text-lg">
              🗂️
            </div>

            <h3 className="text-lg font-extrabold text-[#1F2937] mb-4">
              Choose the Right Category
            </h3>

            <ul className="space-y-2 text-sm text-[#6B7280]">
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
                <li key={name} className="flex gap-2">
                  <span>{emoji}</span>
                  <span>
                    <span className="font-semibold text-[#374151]">{name}</span>{' '}
                    — {desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#FFFDF9] border border-[#E7DED1] rounded-3xl p-6 sm:p-7">
            <div className="w-11 h-11 bg-[#DCE8F7] rounded-2xl flex items-center justify-center mb-5 text-lg">
              ✏️
            </div>

            <h3 className="text-lg font-extrabold text-[#1F2937] mb-3">
              Describe Clearly
            </h3>

            <p className="text-sm text-[#6B7280] mb-4">
              Include what is wrong and exactly where it is happening.
            </p>

            <div className="space-y-2">
              {[
                '"Large pothole near hospital road"',
                '"No water supply for 3 days"',
                '"Exposed wires at market area"',
              ].map((ex) => (
                <div
                  key={ex}
                  className="bg-[#F6F1E8] border border-[#E7DED1] rounded-xl px-3 py-2 text-xs text-[#6B7280]"
                >
                  {ex}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#FFFDF9] border border-[#E7DED1] rounded-3xl p-6 sm:p-7">
            <div className="w-11 h-11 bg-[#EFE6DA] rounded-2xl flex items-center justify-center mb-5 text-lg">
              ⚠️
            </div>

            <h3 className="text-lg font-extrabold text-[#1F2937] mb-4">
              Indicate Urgency
            </h3>

            <div className="space-y-3 text-sm">
              {[
                {
                  emoji: '🚨',
                  title: 'High Priority',
                  desc: 'Immediate danger like live wires, flooding, accidents',
                  color: '#FDE2E2',
                },
                {
                  emoji: '⚠️',
                  title: 'Medium Priority',
                  desc: 'Ongoing issues like broken roads or garbage buildup',
                  color: '#FFF3D6',
                },
                {
                  emoji: '🟢',
                  title: 'Low Priority',
                  desc: 'Minor issues like small cracks or faded paint',
                  color: '#E6F4EA',
                },
              ].map((p) => (
                <div
                  key={p.title}
                  className="border border-[#E7DED1] rounded-xl p-3"
                  style={{ backgroundColor: p.color }}
                >
                  <p className="font-semibold text-[#374151] text-xs mb-1">
                    {p.emoji} {p.title}
                  </p>
                  <p className="text-xs text-[#6B7280]">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#FFFDF9] border border-[#E7DED1] rounded-3xl p-6 sm:p-7">
            <div className="w-11 h-11 bg-[#E7F3EE] rounded-2xl flex items-center justify-center mb-5 text-lg">
              📋
            </div>

            <h3 className="text-lg font-extrabold text-[#1F2937] mb-4">
              Add Supporting Details
            </h3>

            <ul className="space-y-3 text-sm text-[#6B7280]">
              {[
                ['📸', 'Upload photo', 'Helps authorities verify faster'],
                ['📍', 'Share location', 'Improves response accuracy'],
                ['🕐', 'Mention duration', 'How long the issue has existed'],
              ].map(([emoji, title, desc]) => (
                <li key={title} className="flex gap-3">
                  <span>{emoji}</span>
                  <div>
                    <p className="font-semibold text-[#374151]">{title}</p>
                    <p className="text-xs text-[#9CA3AF]">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 bg-[#F3E7D3] border border-[#E7DED1] rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-[#7C6A55] mb-1">Tip</p>
              <p className="text-xs text-[#6B7280]">
                Clear reports get faster and more accurate responses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────────── */}
      <section id="categories" className="py-20 sm:py-24 px-4 bg-[#F6F1E8]">
        <SectionHeader
          label="Departments"
          title="Issue Categories"
          sub="Report problems across all civic departments."
        />

        <div className="max-w-5xl mx-auto mt-12 grid grid-cols-2 sm:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="
          bg-[#FFFDF9]
          border border-[#E7DED1]
          rounded-3xl
          p-5 sm:p-6
          flex items-center gap-3
          transition-all duration-300
          hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(15,23,42,0.08)]
        "
            >
              <span className="text-2xl">{cat.emoji}</span>

              <span className="text-sm font-extrabold text-[#374151] leading-tight">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 px-4 bg-[#1E1B18] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(192,132,87,0.10)_0%,transparent_70%)]" />
        </div>

        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8F4EE] mb-4 tracking-tight">
            Ready to make your community better?
          </h2>

          <p className="text-[#A8A29E] text-sm sm:text-base font-medium mb-10 leading-relaxed">
            Join citizens already improving local services across Nepal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="
          inline-flex items-center justify-center gap-2
          bg-[#C08457] hover:bg-[#A86E3B]
          text-white font-bold
          px-8 sm:px-10 py-3.5 sm:py-4
          rounded-full
          transition-all
          w-full sm:w-auto
        "
            >
              Create Account
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/login"
              className="
          inline-flex items-center justify-center gap-2
          bg-transparent
          border border-[#3A342D]
          text-[#F8F4EE]
          font-bold
          px-8 sm:px-10 py-3.5 sm:py-4
          rounded-full
          hover:border-[#C08457]
          transition-colors
          w-full sm:w-auto
        "
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="py-10 px-4 bg-[#1E1B18] border-t border-[#3A342D]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C08457] flex items-center justify-center">
              <Shield size={14} className="text-white" />
            </div>

            <span className="font-extrabold text-[#F8F4EE] text-base tracking-tight">
              Civic<span className="text-[#C08457]">Aid</span>
            </span>
          </div>

          <p className="text-xs text-[#A8A29E] text-center">
            © 2026 CivicAid Nepal. Built for citizens, by Binita & Shova.
          </p>

          <div className="flex items-center gap-6 text-xs text-[#A8A29E]">
            <Link
              className="hover:text-[#F8F4EE] transition-colors"
              to="/login"
            >
              Sign In
            </Link>
            <Link
              className="hover:text-[#F8F4EE] transition-colors"
              to="/register"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
