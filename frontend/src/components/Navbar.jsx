/* eslint-disable no-unused-vars */
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  MapPin,
  LogOut,
  Home,
  Shield,
  User,
  Menu,
  X,
  ClipboardList,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import toast from 'react-hot-toast'
import NotificationBell from './NotificationBell'

const NAV_LINKS = {
  admin: [{ label: 'Admin', path: '/admin', icon: Shield }],
  staff: [{ label: 'Staff', path: '/staff', icon: User }],
  citizen: [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Submit Issue', path: '/submit', icon: MapPin },
    { label: 'Issues', path: '/issues', icon: ClipboardList },
    { label: 'Map', path: '/map', icon: MapPin },
  ],
}

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    function handleOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const roleLinks = NAV_LINKS[user?.role] || []
  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-[#fafaf9]/95 backdrop-blur-lg border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-3 no-underline">
            <div className="w-9 h-9 rounded-[10px_3px_10px_3px] bg-indigo-700 flex items-center justify-center shadow-sm">
              <Shield size={15} className="text-white" />
            </div>
            <span className="text-[22px] font-black tracking-tight text-slate-900">
              Civic<span className="text-indigo-700">Aid</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {roleLinks.map(({ label, path, icon: LinkIcon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-[0.15em] transition-all ${
                  isActive(path)
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LinkIcon size={14} />
                {label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Notifications */}
            <NotificationBell />

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100
                  border border-slate-200 px-3 py-1.5 rounded-full transition-colors"
              >
                <div
                  className="w-7 h-7 bg-indigo-500 text-white flex items-center
                  justify-center rounded-full text-xs font-black"
                >
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="text-sm hidden sm:block text-left">
                  <p className="font-black text-slate-900 text-xs tracking-tight leading-none mb-0.5">
                    {user?.name}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400  leading-none">
                    {user?.role}
                  </p>
                </div>
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl
                  border border-slate-200 shadow-xl z-50 overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-4 py-4 bg-[#01104e]">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 bg-indigo-700 text-white flex items-center
                        justify-center rounded-[8px_2px_8px_2px] text-lg font-black"
                      >
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-sm text-slate-100 tracking-tight">
                          {user?.name}
                        </p>
                        <p className="text-xs text-slate-100 font-black">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-2">
                    <Link
                      to="/issues"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold
                        text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <ClipboardList size={14} className="text-indigo-500" />
                      Issues
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold
                        text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <User size={14} className="text-indigo-500" />
                      Profile
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-100 p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold
                        text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-[#fafaf9] px-4 py-3 flex flex-col gap-1">
          {roleLinks.map(({ label, path, icon: LinkIcon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-bold
                uppercase tracking-[0.15em] transition-colors ${
                  isActive(path)
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <LinkIcon size={14} />
              {label}
            </Link>
          ))}

          <div className="mt-1 px-1">
            <NotificationBell />
          </div>

          <div className="border-t border-slate-200 mt-1 pt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold
                text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
