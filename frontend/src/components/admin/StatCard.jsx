const ACCENT = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-100   text-blue-600',
    value: 'text-blue-700',
    border: 'border-blue-100',
  },
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'bg-emerald-100 text-emerald-600',
    value: 'text-emerald-700',
    border: 'border-emerald-100',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'bg-orange-100 text-orange-600',
    value: 'text-orange-700',
    border: 'border-orange-100',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'bg-red-100    text-red-600',
    value: 'text-red-700',
    border: 'border-red-100',
  },
  violet: {
    bg: 'bg-violet-50',
    icon: 'bg-violet-100 text-violet-600',
    value: 'text-violet-700',
    border: 'border-violet-100',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'bg-amber-100  text-amber-600',
    value: 'text-amber-700',
    border: 'border-amber-100',
  },
  slate: {
    bg: 'bg-slate-50',
    icon: 'bg-slate-100  text-slate-600',
    value: 'text-slate-700',
    border: 'border-slate-200',
  },
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = 'blue',
  loading = false,
  onClick,
}) {
  const a = ACCENT[accent] ?? ACCENT.blue

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100" />
          <div className="w-16 h-3 bg-slate-100 rounded-full" />
        </div>
        <div className="w-20 h-7 bg-slate-100 rounded-lg mb-2" />
        <div className="w-28 h-3 bg-slate-100 rounded-full" />
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-2xl border ${a.border}
    shadow-sm hover:shadow-md transition-shadow duration-200 p-5 overflow-hidden
    ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div
        className={`absolute inset-0 ${a.bg} opacity-30 pointer-events-none`}
      />

      <div className="relative">
        {/* Icon + label row */}
        <div className="flex items-start justify-between mb-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.icon}`}
          >
            {Icon && <Icon size={18} strokeWidth={2} />}
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {label}
          </span>
        </div>

        {/* Value */}
        <p className={`text-3xl font-black tracking-tight ${a.value} mb-1`}>
          {value ?? '—'}
        </p>

        {/* Sub */}
        {sub && <p className="text-xs text-slate-400 font-medium">{sub}</p>}
      </div>
    </div>
  )
}
