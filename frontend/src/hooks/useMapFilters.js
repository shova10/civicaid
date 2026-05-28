const ALL = 'all'

export const CATEGORIES = [
  'road',
  'water',
  'electricity',
  'sanitation',
  'park',
  'safety',
  'other',
]

export const PRIORITIES = ['high', 'medium', 'low']

export const STATUSES = ['pending', 'open', 'in_progress', 'resolved', 'closed']

import { useState, useMemo } from 'react'

export default function useMapFilters(issues) {
  const [category, setCategory] = useState(ALL)
  const [priority, setPriority] = useState(ALL)
  const [status, setStatus] = useState(ALL)

  const filtered = useMemo(() => {
    return issues.filter((issue) => {
      if (category !== ALL && issue.category !== category) return false
      if (priority !== ALL && issue.priority !== priority) return false
      if (status !== ALL && issue.status !== status) return false
      return true
    })
  }, [issues, category, priority, status])

  function reset() {
    setCategory(ALL)
    setPriority(ALL)
    setStatus(ALL)
  }

  const activeCount = [category, priority, status].filter(
    (v) => v !== ALL
  ).length

  return {
    filters: { category, priority, status },
    setCategory,
    setPriority,
    setStatus,
    filtered,
    reset,
    activeCount,
  }
}
