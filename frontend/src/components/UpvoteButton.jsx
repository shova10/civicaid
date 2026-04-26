import { useState } from 'react'
import { ThumbsUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { upvoteIssue } from '../services/issues'

export default function UpvoteButton({
  issueId,
  initialCount = 0,
  initialVoted = false,
  size = 'md',
}) {
  const [count, setCount] = useState(initialCount)
  const [voted, setVoted] = useState(initialVoted)
  const [loading, setLoading] = useState(false)
  const [pop, setPop] = useState(false)

  async function handleUpvote(e) {
    e.stopPropagation()

    if (voted || loading) return

    setCount((c) => c + 1)
    setVoted(true)
    setPop(true)
    setTimeout(() => setPop(false), 400)

    try {
      const data = await upvoteIssue(issueId)

      if (data?.upvote_count !== undefined) setCount(data.upvote_count)
    } catch (err) {
      setCount((c) => c - 1)
      setVoted(false)
      toast.error(
        err?.response?.data?.message ?? 'Could not register your vote.'
      )
    } finally {
      setLoading(false)
    }
  }

  const isSm = size === 'sm'

  return (
    <button
      onClick={handleUpvote}
      disabled={voted || loading}
      title={voted ? 'You already upvoted this' : 'Upvote this issue'}
      className={`
        group inline-flex items-center gap-1.5 rounded-full border font-semibold
        transition-all duration-200 select-none
        ${isSm ? 'text-xs px-2.5 py-1' : 'text-sm px-3.5 py-1.5'}
        ${
          voted
            ? 'bg-orange-50 border-orange-200 text-orange-600 cursor-default'
            : 'bg-white border-slate-200 text-slate-500 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50 cursor-pointer'
        }
        ${loading ? 'opacity-60' : ''}
      `}
    >
      <ThumbsUp
        size={isSm ? 12 : 14}
        strokeWidth={2.5}
        className={`
          transition-transform duration-200
          ${pop ? 'scale-125' : 'scale-100'}
          ${voted ? 'fill-orange-400 text-orange-400' : 'group-hover:scale-110'}
        `}
      />
      <span
        className={`
          tabular-nums transition-all duration-200
          ${pop ? 'scale-110' : 'scale-100'}
        `}
      >
        {count}
      </span>
    </button>
  )
}
