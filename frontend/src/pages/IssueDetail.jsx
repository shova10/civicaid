import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Tag,
  AlertCircle,
  ImageOff,
  CalendarDays,
  Hash,
} from 'lucide-react'
import toast from 'react-hot-toast'
import StatusBadge from '../components/StatusBadge'
import PriorityBadge from '../components/PriorityBadge'
import StatusTimeline from '../components/StatusTimeline'
import { getMyIssueById, updateIssueStatus } from '../services/issues'
import UpvoteButton from '../components/UpvoteButton'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-5 w-32 bg-slate-200 rounded-full" />
      <div className="h-8 w-2/3 bg-slate-200 rounded-xl" />
      <div className="flex gap-2">
        <div className="h-5 w-20 bg-slate-200 rounded-full" />
        <div className="h-5 w-16 bg-slate-200 rounded-full" />
      </div>
      <div className="h-48 bg-slate-200 rounded-2xl" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded-full w-full" />
        <div className="h-3 bg-slate-200 rounded-full w-5/6" />
        <div className="h-3 bg-slate-200 rounded-full w-4/6" />
      </div>
    </div>
  )
}

function MetaItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={13} className="text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
          {label}
        </p>
        <p className="text-sm text-slate-700 font-medium wrap-break-words">
          {value}
        </p>
      </div>
    </div>
  )
}

function IssueImage({ src, title }) {
  const [expanded, setExpanded] = useState(false)

  if (!src) {
    return (
      <div
        className="w-full h-48 rounded-2xl bg-slate-100 flex flex-col items-center
        justify-center gap-2 border border-slate-200"
      >
        <ImageOff size={24} className="text-slate-300" />
        <span className="text-xs text-slate-300 font-medium">
          No photo attached
        </span>
      </div>
    )
  }

  return (
    <>
      <div
        onClick={() => setExpanded(true)}
        className="w-full rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in
          shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <img
          src={src}
          alt={title}
          className="w-full h-56 object-cover hover:scale-[1.02] transition-transform duration-300"
        />
      </div>

      {expanded && (
        <div
          onClick={() => setExpanded(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center
            justify-center p-4 cursor-zoom-out"
        >
          <img
            src={src}
            alt={title}
            className="max-w-full max-h-full rounded-xl shadow-2xl"
          />
        </div>
      )}
    </>
  )
}

export default function IssueDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [issue, setIssue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchIssue() {
      setLoading(true)
      setError(false)
      try {
        const data = await getMyIssueById(id)
        setIssue(data)
      } catch (err) {
        setError(true)
        toast.error(
          err?.response?.data?.message ?? 'Could not load this issue.'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchIssue()
  }, [id, isAdmin])

  async function handleStatusChange(newStatus) {
    try {
      await updateIssueStatus(id, newStatus)
      setIssue((prev) => ({ ...prev, status: newStatus }))
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`)
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to update status.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800
            font-medium transition-colors duration-150 mb-6 group"
        >
          <ArrowLeft
            size={15}
            className="group-hover:-translate-x-0.5 transition-transform duration-150"
          />
          Back to Issues
        </button>

        {loading ? (
          <Skeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <AlertCircle size={28} className="text-red-400" />
            </div>
            <h2 className="text-slate-700 font-semibold text-lg mb-1">
              Issue not found
            </h2>
            <p className="text-slate-400 text-sm mb-5">
              This issue doesn't exist or you don't have access to it.
            </p>
            <button
              onClick={() => navigate('/my-issues')}
              className="text-sm bg-slate-800 text-white px-4 py-2 rounded-xl
                hover:bg-slate-700 transition-colors font-medium"
            >
              Go back
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    #{issue.id}
                  </span>
                  <span className="text-slate-200">·</span>
                  <span className="text-xs font-semibold text-slate-500">
                    {issue.category}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-4">
                  {issue.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={issue.status} />
                  <PriorityBadge priority={issue.priority} />
                  <div className="ml-auto">
                    <UpvoteButton
                      issueId={issue.id}
                      initialCount={issue.upvote_count ?? 0}
                      initialVoted={issue.has_upvoted ?? false}
                    />
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Photo
                </h2>
                <IssueImage src={issue.image || null} title={issue.title} />
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Description
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {issue.description}
                </p>
              </div>

              {/* AI Analysis */}
              {(issue.ai_category ||
                issue.ai_priority ||
                issue.is_duplicate) && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                    <span className="text-blue-500">✦</span> AI Analysis
                  </h2>
                  <div className="space-y-3">
                    {issue.ai_category && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">
                          AI Category
                        </span>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                          {issue.ai_category}
                        </span>
                      </div>
                    )}
                    {issue.ai_priority && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">
                          AI Priority
                        </span>
                        <PriorityBadge priority={issue.ai_priority} size="sm" />
                      </div>
                    )}
                    {issue.is_duplicate && (
                      <div className="flex items-start gap-2 p-2.5 bg-amber-50 rounded-xl border border-amber-200 mt-1">
                        <span className="text-amber-500 shrink-0">⚠️</span>
                        <p className="text-xs text-amber-700 font-medium">
                          AI detected this may be a duplicate of an existing
                          issue.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-5">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Details
                </h2>
                <div className="divide-y divide-slate-100">
                  <MetaItem
                    icon={Tag}
                    label="Category"
                    value={issue.category}
                  />
                  {issue.location_name && (
                    <MetaItem
                      icon={MapPin}
                      label="Location"
                      value={issue.location_name}
                    />
                  )}
                  <MetaItem
                    icon={CalendarDays}
                    label="Reported on"
                    value={formatDate(issue.created_at)}
                  />
                  {issue.updated_at && (
                    <MetaItem
                      icon={Clock}
                      label="Last updated"
                      value={formatDateTime(issue.updated_at)}
                    />
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Progress
                </h2>
                <StatusTimeline
                  status={issue.status}
                  history={issue.status_history ?? []}
                  isAdmin={isAdmin}
                  onStatusChange={handleStatusChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
