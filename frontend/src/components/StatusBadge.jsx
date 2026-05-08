const STATUS_CONFIG = {
  reported: {
    label: 'Reported',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-400',
  },
  pending: {
    label: 'reported',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
  },
  open: {
    label: 'verified',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-400',
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    dot: 'bg-violet-400',
    pulse: true,
  },
  resolved: {
    label: 'Resolved',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-400',
  },
  closed: {
    label: 'Closed',
    bg: 'bg-slate-100',
    text: 'text-slate-500',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    dot: 'bg-red-400',
  },
}

const DEFAULT = {
  label: 'Unknown',
  bg: 'bg-gray-100',
  text: 'text-gray-500',
  border: 'border-gray-200',
  dot: 'bg-gray-400',
}


export default function StatusBadge({ status, size = 'md' }) {
  const cfg = STATUS_CONFIG[status] ?? DEFAULT

  const sizeClasses =
    size === 'sm'
      ? 'text-xs px-2 py-0.5 gap-1'
      : 'text-xs font-medium px-2.5 py-1 gap-1.5'

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium tracking-wide
        ${cfg.bg} ${cfg.text} ${cfg.border} ${sizeClasses}`}
    >
      <span className="relative flex items-center justify-center">
        {cfg.pulse ? (
          <>
            <span
              className={`absolute inline-flex h-2 w-2 rounded-full opacity-75 animate-ping ${cfg.dot}`}
            />
            <span
              className={`relative inline-flex h-1.5 w-1.5 rounded-full ${cfg.dot}`}
            />
          </>
        ) : (
          <span className={`inline-flex h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
        )}
      </span>
      {cfg.label}
    </span>
  )
}
