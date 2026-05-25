import { useEffect, useState, useRef } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  User,
  Camera,
  Shield,
  Calendar,
  Key,
  CheckCircle,
  Lock,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Avatar from '../../components/Avatar'
import useAuth from '../../hooks/useAuth'
import { getProfile } from '../../services/auth'

const EMOJI_OPTIONS = [
  '😀',
  '😎',
  '🧑',
  '👩',
  '👨',
  '🧔',
  '👸',
  '🤴',
  '🦸',
  '🧙',
  '🐱',
  '🐶',
  '🦊',
  '🐼',
  '🐨',
  '🦁',
  '🐯',
  '🐻',
  '🌟',
  '🔥',
  '💎',
  '🎯',
  '🚀',
  '🌈',
]

function AvatarPicker({ userId, onClose }) {
  const [tab, setTab] = useState('emoji')
  const fileRef = useRef()
  const storageKey = `avatar_${userId}`

  function saveEmoji(emoji) {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ type: 'emoji', value: emoji })
    )
    onClose()
    window.dispatchEvent(new Event('avatar-updated'))
  }

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ type: 'image', value: reader.result })
      )
      onClose()
      window.dispatchEvent(new Event('avatar-updated'))
    }
    reader.readAsDataURL(file)
  }

  function resetAvatar() {
    localStorage.removeItem(storageKey)
    onClose()
    window.dispatchEvent(new Event('avatar-updated'))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-800 text-sm">Choose Avatar</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <div className="flex border-b border-slate-100">
          {['emoji', 'photo'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors
                ${tab === t ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {t === 'emoji' ? '😀 Emoji' : '📷 Photo'}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === 'emoji' ? (
            <div className="grid grid-cols-6 gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => saveEmoji(emoji)}
                  className="w-10 h-10 text-2xl rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div
                onClick={() => fileRef.current?.click()}
                className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300
                  flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <Camera size={20} className="text-slate-400 mb-1" />
                <span className="text-[10px] text-slate-400 font-bold">
                  Upload
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                JPG, PNG or GIF · max 2MB
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
            </div>
          )}
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={resetAvatar}
            className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Reset to default
          </button>
        </div>
      </div>
    </div>
  )
}

function EditableAvatar({ displayName, userId }) {
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <>
      <div
        className="relative group cursor-pointer"
        onClick={() => setPickerOpen(true)}
      >
        <Avatar
          userId={userId}
          name={displayName}
          size="lg"
          className="border-4 border-white shadow-md"
        />
        <div className="absolute inset-0 rounded-2xl bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera size={16} className="text-white" />
        </div>
      </div>
      {pickerOpen && (
        <AvatarPicker userId={userId} onClose={() => setPickerOpen(false)} />
      )}
    </>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} className="text-slate-500" />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-700">{value || '—'}</p>
      </div>
    </div>
  )
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-36 bg-white rounded-2xl border border-slate-200" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-white rounded-2xl border border-slate-200"
          />
        ))}
      </div>
      <div className="h-64 bg-white rounded-2xl border border-slate-200" />
    </div>
  )
}

export default function AdminProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile()
        setProfile(data)
      } catch {
        toast.error('Could not load profile.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const displayName =
    profile?.full_name ?? profile?.name ?? user?.name ?? 'Admin'
  const displayEmail = profile?.email ?? user?.email ?? '—'
  const displayPhone = profile?.phone ?? '—'
  const displayAddr = profile?.address ?? '—'
  const userId = profile?.id ?? user?.id ?? 'default'
  const joinedDate = formatDate(profile?.date_joined ?? user?.date_joined)

  if (loading) return <Skeleton />

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          My Profile
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Manage your admin account
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-20 bg-linear-to-r from-blue-500 to-violet-500" />
          <div className="px-6 pb-6">
            <div className="-mt-8 flex items-end justify-between mb-4">
              <EditableAvatar displayName={displayName} userId={userId} />
              <div className="flex items-center gap-2 mt-8">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold
                  px-2.5 py-1 rounded-full border bg-violet-50 text-violet-700 border-violet-200"
                >
                  <Shield size={10} />
                  Admin
                </span>
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold
                  px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-600 border-emerald-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Active
                </span>
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 mb-0.5">
              {displayName}
            </h1>
            <p className="text-sm text-slate-500">{displayEmail}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Role', value: 'Admin', color: 'text-violet-600' },
            {
              label: 'Member Since',
              value: joinedDate.split(' ')[2] ?? '—',
              color: 'text-blue-600',
            },
            { label: 'Status', value: 'Active', color: 'text-emerald-600' },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center"
            >
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal info */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Personal Information
            </h2>
            <InfoRow icon={User} label="Full Name" value={displayName} />
            <InfoRow icon={Mail} label="Email" value={displayEmail} />
            <InfoRow icon={Phone} label="Phone" value={displayPhone} />
            <InfoRow icon={MapPin} label="Address" value={displayAddr} />
            <InfoRow icon={Calendar} label="Joined" value={joinedDate} />
          </div>

          {/* Account & security */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Account &amp; Security
            </h2>
            <InfoRow icon={Shield} label="Role" value="Administrator" />
            <InfoRow icon={CheckCircle} label="Account Status" value="Active" />
            <InfoRow icon={Lock} label="Password" value="••••••••••••" />
          </div>
        </div>
      </div>
    </div>
  )
}
