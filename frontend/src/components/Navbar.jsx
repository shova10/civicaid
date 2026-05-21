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
import Avatar from './Avatar'
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
  const displayName = user?.citizen_name || user?.full_name || user?.name

  return (
    <nav className="sticky top-0 z-50 bg-[#F6F1E8]/95 backdrop-blur-lg border-b border-[#E7DDCF]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-3 no-underline">
            <div className="w-9 h-9 rounded-[10px_3px_10px_3px] bg-indigo-700 flex items-center justify-center shadow-sm">
              <Shield size={15} className="text-white" />
            </div>
            <span className="text-[22px] font-black tracking-tight text-[#1C1A17]">
              Civic<span className="text-indigo-700">Aid</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {roleLinks.map(({ label, path, icon: LinkIcon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-200 no-underline
                ${
                  isActive(path)
                    ? 'bg-[#EFE6DA] text-[#1C1A17] shadow-sm'
                    : 'text-[#6B665E] hover:text-[#1C1A17] hover:bg-[#EFE6DA]'
                }`}
              >
                <LinkIcon size={14} />
                {label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <NotificationBell />

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-3 bg-[#FFFBF5] hover:bg-[#FFF7ED]
                border border-[#E7DDCF] px-3 py-2 rounded-full transition-all shadow-sm"
              >
                <Avatar userId={user?.id} name={displayName} size="sm" />
                <p className="font-black text-[#1C1A17] text-[11px] tracking-[0.08em] uppercase leading-none">
                  {displayName}
                </p>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#FFFBF5] rounded-2xl border border-[#E7DDCF] shadow-xl z-50 overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-4 bg-[#F6F1E8] border-b border-[#E7DDCF]">
                    <div className="flex items-center gap-3">
                      <Avatar userId={user?.id} name={displayName} size="sm" />
                      <div>
                        <p className="font-black text-sm text-[#1C1A17] tracking-tight">
                          {displayName}
                        </p>
                        <p className="text-xs text-[#6B665E]">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="py-2">
                    <Link
                      to="/issues"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold
                      text-[#6B665E] hover:bg-[#EFE6DA] hover:text-[#1C1A17] transition-colors no-underline"
                    >
                      <ClipboardList size={14} className="text-indigo-600" />
                      Issues
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold
                      text-[#6B665E] hover:bg-[#EFE6DA] hover:text-[#1C1A17] transition-colors no-underline"
                    >
                      <User size={14} className="text-indigo-600" />
                      Profile
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-[#E7DDCF] p-2">
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
            className="md:hidden p-2 text-[#6B665E] hover:text-[#1C1A17] hover:bg-[#EFE6DA] rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#E7DDCF] bg-[#F6F1E8] px-4 py-3 flex flex-col gap-1">
          {roleLinks.map(({ label, path, icon: LinkIcon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all no-underline
              ${
                isActive(path)
                  ? 'bg-[#EFE6DA] text-[#1C1A17]'
                  : 'text-[#6B665E] hover:bg-[#EFE6DA] hover:text-[#1C1A17]'
              }`}
            >
              <LinkIcon size={14} />
              {label}
            </Link>
          ))}

          <div className="mt-3 px-1">
            <div className="bg-[#FFFBF5] border border-[#E7DDCF] rounded-xl p-2">
              <NotificationBell />
            </div>
          </div>

          <div className="border-t border-[#E7DDCF] mt-3 pt-2">
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
