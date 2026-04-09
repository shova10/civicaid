import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import { getMyIssues } from '../services/issues'
import IssueCard from '../components/IssueCard'

export default function Profile() {
  const { user } = useAuth()

  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    async function fetchIssues() {
      try {
        const data = await getMyIssues()
        setIssues(data)
      } catch (err) {
        console.error('Error fetching issues:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchIssues()
  }, [])

  const total = issues.length
  const resolved = issues.filter((i) => i.status === 'resolved').length
  const pending = issues.filter((i) => i.status === 'pending').length

  const filteredIssues = filter
    ? issues.filter((i) => i.status === filter)
    : issues

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading profile...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* 🔷 Profile Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 text-white flex items-center justify-center rounded-full text-xl font-bold">
            {user?.name?.charAt(0)}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              {user?.name || 'User'}
            </h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-1 inline-block">
              Citizen
            </span>
          </div>
        </div>

        {/* 📊 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-center">
            <p className="text-2xl font-bold text-slate-800">{total}</p>
            <p className="text-sm text-slate-500 mt-1">Total Issues</p>
          </div>

          <div className="bg-green-50 p-5 rounded-2xl border border-green-100 text-center">
            <p className="text-2xl font-bold text-green-600">{resolved}</p>
            <p className="text-sm text-green-700 mt-1">Resolved</p>
          </div>

          <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-100 text-center">
            <p className="text-2xl font-bold text-yellow-600">{pending}</p>
            <p className="text-sm text-yellow-700 mt-1">Pending</p>
          </div>
        </div>

        {/* 📂 Issues Section */}
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="text-lg font-semibold text-slate-800">
              My Issues
            </h3>

            <select
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {filteredIssues.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center text-slate-500 shadow-sm">
              No issues found.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}