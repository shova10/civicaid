/* eslint-disable no-unused-vars */
// src/layouts/AdminLayout.jsx
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Map,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'
import useAuth from '../hooks/useAuth'

const NAV_ITEMS = [
  {
    section: 'Overview',
    links: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/admin/issues', label: 'Issues', icon: ClipboardList },
      { to: '/admin/map', label: 'Map', icon: Map },
    ],
  },
  {
    section: 'Management',
    links: [
      { to: '/admin/users', label: 'Users', icon: Users },
      { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
      { to: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
]

function SidebarLink({ to, label, icon: Icon, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-150
        ${
          isActive
            ? 'bg-white/10 text-white'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={17}
            className={`shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}
          />
          <span className="flex-1">{label}</span>
          {isActive && (
            <ChevronRight size={13} className="text-blue-400 shrink-0" />
          )}
        </>
      )}
    </NavLink>
  )
}

// ─── Sidebar content (shared between desktop + mobile) ────────────────────────
function SidebarContent({ onLinkClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
            <ShieldCheck size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">
              CivicAid
            </p>
            <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {NAV_ITEMS.map((section) => (
          <div key={section.section}>
            <p
              className="text-[10px] font-bold uppercase tracking-widest text-slate-600
              px-3 mb-1.5"
            >
              {section.section}
            </p>
            <div className="space-y-0.5">
              {section.links.map((link) => (
                <SidebarLink key={link.to} {...link} onClick={onLinkClick} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 mb-2">
          <div
            className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30
            flex items-center justify-center shrink-0"
          >
            <span className="text-xs font-bold text-blue-400">
              {user?.name?.[0]?.toUpperCase() ?? 'A'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.name ?? 'Admin'}
            </p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10
            transition-all duration-150"
        >
          <LogOut size={16} className="shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  )
}

// ─── Main layout ──────────────────────────────────────────────────────────────
export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* ── Desktop sidebar ─────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex lg:flex-col w-60 bg-slate-900 shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile sidebar overlay ──────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 flex flex-col
            shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-0">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Menu
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10
                  transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <SidebarContent onLinkClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Main content area ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header
          className="lg:hidden flex items-center gap-3 px-4 py-3
          bg-slate-900 border-b border-white/10 shrink-0"
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10
              transition-colors"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-blue-400" />
            <span className="text-white font-bold text-sm">CivicAid Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
