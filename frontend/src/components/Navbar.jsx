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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 🔷 Logo */}
          <Link
            to="/home"
            className="text-xl font-bold bg-linear-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent"
          >
            CivicAid
          </Link>

          {/* 🔗 Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            {roleLinks.map(({ label, path, icon: LinkIcon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(path)
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <LinkIcon size={16} />
                {label}
              </Link>
            ))}
          </div>

          {/* 👤 Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* 🔔 Notifications */}
            <NotificationBell />

            {/* 👤 Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full text-sm font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>

                <div className="text-sm hidden sm:block">
                  <p className="font-medium text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role}
                  </p>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-4 bg-blue-50 border-b">
                    <p className="font-bold text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>

                  {/* Menu */}
                  <div className="py-2">
                    <Link
                      to="/issues"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      <ClipboardList size={14} />
                      Issues
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      <User size={14} />
                      Profile
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 📱 Mobile Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 📱 Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-2">
          {roleLinks.map(({ label, path, icon: LinkIcon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-gray-100"
            >
              <LinkIcon size={16} />
              {label}
            </Link>
          ))}

          {/* Mobile Notification */}
          <div className="mt-2">
            <NotificationBell />
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-red-600"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
