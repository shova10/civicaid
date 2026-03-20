// src/components/IssueCard.jsx
import { MapPin, Clock, ChevronRight, ImageOff } from 'lucide-react'
// import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'

const CATEGORY_COLORS = {
  'Road & Transport': { bg: 'bg-orange-100', text: 'text-orange-700' },
  'Water & Drainage': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  Electricity: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  'Waste Management': { bg: 'bg-lime-100', text: 'text-lime-700' },
  'Public Safety': { bg: 'bg-red-100', text: 'text-red-700' },
  'Parks & Green': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  Other: { bg: 'bg-slate-100', text: 'text-slate-600' },
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function truncate(str, n) {
  if (!str) return ''
  return str.length > n ? str.slice(0, n).trimEnd() + '…' : str
}

/**
 * IssueCard
 * @param {object} issue - issue object from the API
 * @param {function} onClick - optional override for click handler
 */
export default function IssueCard({ issue, onClick }) {
  // const navigate = useNavigate();
  const catStyle = CATEGORY_COLORS[issue.category] ?? CATEGORY_COLORS['Other']

  function handleClick() {
    if (onClick) return onClick(issue)
    // navigate(`/issues/${issue.id}`);
  }

  return (
    <article
      onClick={handleClick}
      className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm
        hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer
        overflow-hidden flex flex-col"
    >
      {/* Image or placeholder */}
      <div className="relative h-36 bg-slate-100 overflow-hidden shrink-0">
        {issue.image ? (
          <img
            src={issue.image}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
            <ImageOff size={22} className="text-slate-300" />
            <span className="text-xs text-slate-300 font-medium">No photo</span>
          </div>
        )}

        {/* Category pill overlaid on image */}
        <span
          className={`absolute top-2.5 left-2.5 text-xs font-semibold px-2.5 py-1
            rounded-full ${catStyle.bg} ${catStyle.text}`}
        >
          {issue.category}
        </span>

        {/* Issue ID badge */}
        <span
          className="absolute top-2.5 right-2.5 text-xs font-mono font-semibold
          px-2 py-0.5 rounded-full bg-black/30 text-white backdrop-blur-sm"
        >
          #{issue.id}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        <h3
          className="font-semibold text-slate-800 text-sm leading-snug
          group-hover:text-blue-600 transition-colors duration-150"
        >
          {truncate(issue.title, 72)}
        </h3>

        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
          {truncate(issue.description, 120)}
        </p>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mt-auto pt-1">
          <StatusBadge status={issue.status} size="sm" />
          <PriorityBadge priority={issue.priority} size="sm" />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-4 py-2.5 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-3 text-xs text-slate-400 min-w-0">
          {issue.location && (
            <span className="flex items-center gap-1 min-w-0">
              <MapPin size={11} className="shrink-0" />
              <span className="truncate max-w-30">{issue.location}</span>
            </span>
          )}
          {issue.created_at && (
            <span className="flex items-center gap-1 shrink-0">
              <Clock size={11} />
              {formatDate(issue.created_at)}
            </span>
          )}
        </div>
        <ChevronRight
          size={15}
          className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5
            transition-all duration-150 shrink-0"
        />
      </div>
    </article>
  )
}
