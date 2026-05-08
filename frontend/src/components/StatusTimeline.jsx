import { CheckCircle2, Circle, Clock, XCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'

// The canonical order statuses flow through
const TIMELINE_STEPS = [
  {
    key: 'reported',
    label: 'Submitted',
    description: 'Your issue has been received.',
  },
  {
    key: 'verified',
    label: 'Reviewed',
    description: 'Issue reviewed by our team.',
  },
  {
    key: 'in_progress',
    label: 'In Progress',
    description: 'A team is working on this.',
  },
  {
    key: 'resolved',
    label: 'Resolved',
    description: 'The issue has been resolved.',
  },
]

const STEP_INDEX = {
  reported: 0,
  pending: 0,
  verified: 1,
  in_progress: 2,
  resolved: 3,
  rejected: -1,
}

function StepIcon({ state, isAdmin, isLoading }) {
  if (isLoading)
    return <Loader2 size={18} className="text-blue-500 animate-spin" />
  if (state === 'complete')
    return (
      <CheckCircle2
        size={18}
        className={`text-emerald-500 ${isAdmin ? 'group-hover:text-emerald-600 transition-colors' : ''}`}
        strokeWidth={2}
      />
    )
  if (state === 'active')
    return (
      <span className="relative flex items-center justify-center">
        <span className="absolute inline-flex h-5 w-5 rounded-full bg-blue-400 opacity-30 animate-ping" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500" />
      </span>
    )
  // upcoming
  return (
    <Circle
      size={18}
      className={`${isAdmin ? 'text-slate-300 group-hover:text-blue-400 transition-colors' : 'text-slate-300'}`}
      strokeWidth={1.5}
    />
  )
}

export default function StatusTimeline({
  status,
  history = [],
  isAdmin = false,
  onStatusChange,
}) {
  const [loadingKey, setLoadingKey] = useState(null)

  async function handleStepClick(stepKey) {
    if (!isAdmin || !onStatusChange) return
    if (stepKey === status) return
    if (loadingKey) return

    setLoadingKey(stepKey)
    try {
      await onStatusChange(stepKey)
    } finally {
      setLoadingKey(null)
    }
  }

  // ── Rejected special case ───────────────────────────────────────────────────
  if (status === 'rejected') {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
        <XCircle size={20} className="text-red-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-red-700">Issue Rejected</p>
          <p className="text-xs text-red-400 mt-0.5">
            This issue was reviewed and could not be actioned.
          </p>
        </div>
      </div>
    )
  }

  const currentIndex = STEP_INDEX[status] ?? 0

  return (
    <ol className="relative flex flex-col gap-0">
      {TIMELINE_STEPS.map((step, idx) => {
        const state =
          idx < currentIndex
            ? 'complete'
            : idx === currentIndex
              ? 'active'
              : 'upcoming'

        const isCurrentStep = step.key === status
        const isLoading = loadingKey === step.key
        const historyEntry = history.find((h) => h.status === step.key)

        const clickable = isAdmin && !isCurrentStep && !loadingKey

        return (
          <li key={step.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                onClick={() => clickable && handleStepClick(step.key)}
                className={`flex items-center justify-center w-6 h-6 mt-0.5 rounded-full
                  ${clickable ? 'cursor-pointer group' : 'cursor-default'}
                  ${isAdmin && !isCurrentStep && !loadingKey ? 'relative' : ''}
                `}
              >
                {/* Subtle ring hint for admins on hover */}
                {clickable && (
                  <span
                    className="absolute inset-0 rounded-full ring-0 group-hover:ring-2
                      group-hover:ring-blue-400/40 transition-all duration-150"
                  />
                )}
                <StepIcon
                  state={state}
                  isAdmin={clickable}
                  isLoading={isLoading}
                />
              </div>
              {idx < TIMELINE_STEPS.length - 1 && (
                <div
                  className={`w-px flex-1 my-1 ${
                    idx < currentIndex ? 'bg-emerald-300' : 'bg-slate-200'
                  }`}
                  style={{ minHeight: '24px' }}
                />
              )}
            </div>

            {/* Right column: text (also clickable for admin) */}
            <div
              onClick={() => clickable && handleStepClick(step.key)}
              className={`pb-5 group ${clickable ? 'cursor-pointer' : ''}`}
            >
              <p
                className={`text-sm font-semibold leading-tight transition-colors
                  ${
                    state === 'active'
                      ? 'text-blue-600'
                      : state === 'complete'
                        ? 'text-slate-700'
                        : 'text-slate-400'
                  }
                  ${clickable ? 'group-hover:text-blue-500' : ''}
                `}
              >
                {step.label}

                {state === 'active' && (
                  <span
                    className="ml-2 text-[10px] font-bold uppercase tracking-widest
                    text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full"
                  >
                    Current
                  </span>
                )}

                {/* Admin affordance: show "Set →" hint on hover */}
                {clickable && (
                  <span
                    className="ml-2 text-[10px] font-bold uppercase tracking-widest
                    text-slate-300 group-hover:text-blue-400 transition-colors"
                  >
                    · Set →
                  </span>
                )}
              </p>

              <p
                className={`text-xs mt-0.5 ${
                  state === 'upcoming' ? 'text-slate-300' : 'text-slate-400'
                }`}
              >
                {historyEntry?.note ?? step.description}
              </p>

              {historyEntry?.timestamp && (
                <p className="text-[10px] text-slate-300 mt-0.5 flex items-center gap-1">
                  <Clock size={9} />
                  {new Date(historyEntry.timestamp).toLocaleDateString(
                    'en-US',
                    {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
