import { useState, useMemo } from 'react'

const ALL = 'all'
const PAGE_SIZE_OPTIONS = [10, 25, 50]

const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3, none: 4 }

export default function useIssueTable(issues) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(ALL)
  const [priority, setPriority] = useState(ALL)
  const [category, setCategory] = useState(ALL)

  const [sortKey, setSortKey] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc') // 'asc' | 'desc'

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  function resetFilters() {
    setSearch('')
    setStatus(ALL)
    setPriority(ALL)
    setCategory(ALL)
    setPage(1)
  }

  const activeFilters = [
    search.trim() !== '',
    status !== ALL,
    priority !== ALL,
    category !== ALL,
  ].filter(Boolean).length

  const processed = useMemo(() => {
    let result = [...issues]

    // Filter
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) ||
          i.location?.toLowerCase().includes(q) ||
          String(i.id).includes(q)
      )
    }
    if (status !== ALL) result = result.filter((i) => i.status === status)
    if (priority !== ALL) result = result.filter((i) => i.priority === priority)
    if (category !== ALL) result = result.filter((i) => i.category === category)

    // Sort
    result.sort((a, b) => {
      let aVal, bVal
      switch (sortKey) {
        case 'id':
          aVal = a.id
          bVal = b.id
          break
        case 'title':
          aVal = a.title?.toLowerCase()
          bVal = b.title?.toLowerCase()
          break
        case 'priority':
          aVal = PRIORITY_ORDER[a.priority] ?? 99
          bVal = PRIORITY_ORDER[b.priority] ?? 99
          break
        case 'status':
          aVal = a.status
          bVal = b.status
          break
        case 'upvotes':
          aVal = a.upvote_count ?? 0
          bVal = b.upvote_count ?? 0
          break
        case 'created_at':
        default:
          aVal = new Date(a.created_at)
          bVal = new Date(b.created_at)
          break
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [issues, search, status, priority, category, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const paginated = processed.slice(start, start + pageSize)

  function wrappedSetSearch(v) {
    setSearch(v)
    setPage(1)
  }
  function wrappedSetStatus(v) {
    setStatus(v)
    setPage(1)
  }
  function wrappedSetPriority(v) {
    setPriority(v)
    setPage(1)
  }
  function wrappedSetCategory(v) {
    setCategory(v)
    setPage(1)
  }

  return {
    search,
    setSearch: wrappedSetSearch,
    status,
    setStatus: wrappedSetStatus,
    priority,
    setPriority: wrappedSetPriority,
    category,
    setCategory: wrappedSetCategory,
    activeFilters,
    resetFilters,

    sortKey,
    sortDir,
    handleSort,

    page: safePage,
    setPage,
    pageSize,
    setPageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    totalPages,
    totalFiltered: processed.length,

    rows: paginated,
  }
}
