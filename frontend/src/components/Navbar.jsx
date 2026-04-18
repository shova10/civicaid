/* eslint-disable no-unused-vars */
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { MapPin, LogOut, Home, Shield, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import toast from 'react-hot-toast'

const NAV_LINKS = {
  admin: [{ label: 'Admin', path: '/admin', icon: Shield }],
  staff: [{ label: 'Staff', path: '/staff', icon: User }],
  citizen: [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Submit Issue', path: '/submit', icon: MapPin },
    { label: 'Profile', path: '/profile', icon: User },
    { path: '/issues', label: 'Issues', icon: MapPin },
    { path: '/map', label: 'Map', icon: MapPin },
  ],
}

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const roleLinks = NAV_LINKS[user?.role] || []
  const allLinks = [...roleLinks]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 🔷 Logo */}
          <Link
            to="/"
            className="text-xl font-bold bg-linear-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent"
          >
            CivicAid
          </Link>

          {/* 🔗 Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            {allLinks.map(({ label, path, icon: LinkIcon }) => (
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
          <div className="hidden md:flex items-center gap-4">
            {/* User Info */}
            <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-lg">
              <div className="w-8 h-8 bg-blue-400 text-white flex items-center justify-center rounded-full text-sm font-semibold">
                {user?.name?.charAt(0)}
              </div>

              <div className="text-sm leading-tight">
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          {/* 📱 Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 📱 Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 flex flex-col gap-1 shadow-sm">
          {allLinks.map(({ label, path, icon: LinkIcon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive(path)
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LinkIcon size={16} />
              {label}
            </Link>
          ))}

          <div className="border-t border-gray-100 mt-2 pt-3">
            <div className="flex items-center gap-3 px-2 mb-2">
              <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full text-sm font-semibold">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
