// src/components/StatusTimeline.jsx
import { CheckCircle2, Circle, Clock, XCircle } from 'lucide-react'

// The canonical order statuses flow through
const TIMELINE_STEPS = [
  { key: 'pending',     label: 'Submitted',    description: 'Your issue has been received.' },
  { key: 'open',        label: 'Reviewed',      description: 'Issue reviewed by our team.' },
  { key: 'in_progress', label: 'In Progress',   description: 'A team is working on this.' },
  { key: 'resolved',    label: 'Resolved',      description: 'The issue has been resolved.' },
]

const STEP_INDEX = {
  pending:     0,
  open:        1,
  in_progress: 2,
  resolved:    3,
  closed:      3,
  rejected:   -1,
}

function StepIcon({ state }) {
  if (state === 'complete')
    return <CheckCircle2 size={18} className="text-emerald-500" strokeWidth={2} />
  if (state === 'active')
    return (
      <span className="relative flex items-center justify-center">
        <span className="absolute inline-flex h-5 w-5 rounded-full bg-blue-400 opacity-30 animate-ping" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500" />
      </span>
    )
  return <Circle size={18} className="text-slate-300" strokeWidth={1.5} />
}

/**
 * StatusTimeline
 * @param {string} status        - current issue status
 * @param {array}  history       - optional array of { status, timestamp, note }
 */
export default function StatusTimeline({ status, history = [] }) {
  // Rejected is a special case — show a single rejection state
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
          idx < currentIndex ? 'complete' : idx === currentIndex ? 'active' : 'upcoming'

        // Find matching history entry if provided
        const historyEntry = history.find((h) => h.status === step.key)

        return (
          <li key={step.key} className="flex gap-4">
            {/* Left column: icon + connector line */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-6 h-6 mt-0.5">
                <StepIcon state={state} />
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

            {/* Right column: text */}
            <div className="pb-5">
              <p
                className={`text-sm font-semibold leading-tight ${
                  state === 'active'
                    ? 'text-blue-600'
                    : state === 'complete'
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
                {state === 'active' && (
                  <span className="ml-2 text-[10px] font-bold uppercase tracking-widest
                    text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </p>
              <p className={`text-xs mt-0.5 ${state === 'upcoming' ? 'text-slate-300' : 'text-slate-400'}`}>
                {historyEntry?.note ?? step.description}
              </p>
              {historyEntry?.timestamp && (
                <p className="text-[10px] text-slate-300 mt-0.5 flex items-center gap-1">
                  <Clock size={9} />
                  {new Date(historyEntry.timestamp).toLocaleDateString('en-US', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}