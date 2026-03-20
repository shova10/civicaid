/* eslint-disable no-unused-vars */
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  MapPin,
  LogOut,
  Home,
  Shield,
  User,
  Menu,
  X,
  icons,
} from 'lucide-react'
import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import toast from 'react-hot-toast'

const NAV_LINKS = {
  common: [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Submit Issue', path: '/submit', icon: MapPin },
  ],
  admin: [{ label: 'Admin', path: '/admin', icon: Shield }],
  staff: [{ label: 'Staff', path: '/staff', icon: User }],
  citizen: [
    { label: 'Profile', path: '/profile', icon: User },
    { path: '/issues', label: 'My Issue', icon: MapPin },
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
  const allLinks = [...NAV_LINKS.common, ...roleLinks]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold text-blue-600 tracking-tight"
          >
            CivicAid
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {allLinks.map(({ label, path, icon: LinkIcon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {LinkIcon && <LinkIcon size={16} />}
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {user?.name}
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                {user?.role}
              </span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 px-4 py-3 flex flex-col gap-1">
          // eslint-disable-next-line no-unused-vars
          {allLinks.map(({ label, path, icon: LinkIcon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(path)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LinkIcon size={16} />
              {label}
            </Link>
          ))}
          <div className="border-t border-gray-100 mt-2 pt-2">
            <p className="px-4 py-1 text-xs text-gray-400">
              {user?.name} · {user?.role}
            </p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg w-full transition-colors"
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
