import { useEffect, useState, useRef } from 'react'
import { Bell, Clock, X } from 'lucide-react'
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../services/notifications'

const TYPE_CONFIG = {
  status_updated: { color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
  assigned: { color: 'bg-violet-50 text-violet-600', dot: 'bg-violet-500' },
  submitted: { color: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500' },
  duplicate: { color: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500' },
  default: { color: 'bg-slate-50 text-slate-600', dot: 'bg-slate-400' },
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)

  const unread = notifications.filter((n) => !n.is_read).length

  useEffect(() => {
    function handleOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  useEffect(() => {
    if (!open) return
    async function fetchNotifications() {
      setLoading(true)
      try {
        const data = await getNotifications()
        setNotifications(Array.isArray(data) ? data : (data.results ?? []))
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [open])

  useEffect(() => {
    async function pollCount() {
      try {
        const data = await getNotifications()
        const list = Array.isArray(data) ? data : (data.results ?? [])
        setNotifications(list)
      } catch {
        // silently fail
      }
    }
    const interval = setInterval(pollCount, 60000)
    pollCount()
    return () => clearInterval(interval)
  }, [])

  async function handleMarkRead(id, isRead) {
    if (isRead) return // already read, skip API call
    try {
      await markNotificationRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      )
    } catch {
      // silently fail
    }
  }
  async function handleMarkAllRead() {
    try {
      await markAllNotificationsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    } catch {
      // silently fail
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800
          hover:bg-slate-100 transition-colors"
        title="Notifications"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1
            bg-red-500 text-white text-[10px] font-bold rounded-full
            flex items-center justify-center leading-none"
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl
          border border-slate-200 shadow-xl z-50 overflow-hidden"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3
            border-b border-slate-100"
          >
            <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMarkAllRead()
                  }}
                  className="text-[11px] font-semibold text-blue-500 hover:text-blue-700 transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-slate-100 mt-1.5 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-slate-100 rounded-full w-3/4" />
                      <div className="h-2.5 bg-slate-100 rounded-full w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Bell size={24} className="text-slate-300 mb-2" />
                <p className="text-sm text-slate-400 font-medium">
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((n) => {
                const cfg = TYPE_CONFIG[n.event] ?? TYPE_CONFIG.default
                return (
                  <button
                    key={n.id}
                    onClick={() => handleMarkRead(n.id, n.is_read)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3
                      hover:bg-slate-50 transition-colors border-b border-slate-50
                      ${!n.is_read ? 'bg-blue-50/30' : ''}`}
                  >
                    {/* Unread dot */}
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0
                      ${!n.is_read ? cfg.dot : 'bg-transparent'}`}
                    />

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-semibold leading-snug
                        ${!n.is_read ? 'text-slate-800' : 'text-slate-500'}`}
                      >
                        {n.message ?? 'New notification'}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock size={9} />
                        {formatTime(n.created_at)}
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs text-slate-400 text-center">
                {unread > 0 ? `${unread} unread` : 'All caught up'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
