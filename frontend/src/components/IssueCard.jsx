import { MapPin, Clock, ChevronRight, ImageOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'
import UpvoteButton from './UpvoteButton'

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
  })
}

function truncate(str, n) {
  if (!str) return ''
  return str.length > n ? str.slice(0, n).trimEnd() + '…' : str
}

export default function IssueCard({ issue, onClick }) {
  const navigate = useNavigate()
  const catStyle = CATEGORY_COLORS[issue.category] ?? CATEGORY_COLORS['Other']

  function handleClick() {
    if (onClick) return onClick(issue)
    navigate(`/issues/${issue.id}`)
  }

  return (
    <article
      onClick={handleClick}
      className="group relative bg-white rounded-2xl border border-slate-200
      shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300
      overflow-hidden flex flex-col cursor-pointer"
    >
      <div className="relative h-40 bg-slate-100 overflow-hidden">
        {issue.image ? (
          <>
            <img
              src={issue.image}
              alt={issue.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
            <ImageOff size={22} className="text-slate-300" />
            <span className="text-xs text-slate-300 font-medium">No photo</span>
          </div>
        )}

        {/* Category */}
        <span
          className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1
          rounded-full backdrop-blur-sm ${catStyle.bg} ${catStyle.text}`}
        >
          {issue.category}
        </span>

        {/* ID */}
        <span className="absolute top-3 right-3 text-[11px] font-mono px-2 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-sm">
          #{issue.id}
        </span>
      </div>

      {/*  Content */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        <h3 className="font-semibold text-slate-800 text-[15px] leading-snug group-hover:text-blue-600 transition">
          {truncate(issue.title, 70)}
        </h3>

        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
          {truncate(issue.description, 110)}
        </p>

        {/* Badges */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-2">
            <StatusBadge status={issue.status} size="sm" />
            <PriorityBadge priority={issue.priority} size="sm" />
          </div>

          <UpvoteButton
            issueId={issue.id}
            initialCount={issue.upvote_count ?? 0}
            initialVoted={issue.has_upvoted ?? false}
            size="sm"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-4 py-2.5 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          {issue.location && (
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              <span className="truncate max-w-22">{issue.location}</span>
            </span>
          )}

          {issue.created_at && (
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {formatDate(issue.created_at)}
            </span>
          )}
        </div>

        <ChevronRight
          size={16}
          className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
        />
      </div>
    </article>
  )
}
