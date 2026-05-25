import { useEffect, useState, useRef } from 'react'
import { Phone, MapPin, Mail, User, Camera } from 'lucide-react'
import toast from 'react-hot-toast'
import ChangePasswordModal from '../components/ChangePasswordModal'
import IssueCard from '../components/IssueCard'
import Avatar from '../components/Avatar'
import useAuth from '../hooks/useAuth'
import { getMyOwnIssues } from '../services/issues'
import { getProfile } from '../services/auth'

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
        {/* Reuse the shared Avatar component, add the hover overlay on top */}
        <Avatar
          userId={userId}
          name={displayName}
          size="lg"
          className="border-4 border-white shadow-md"
        />
        <div
          className="absolute inset-0 rounded-2xl bg-black/30 opacity-0 group-hover:opacity-100
            transition-opacity flex items-center justify-center"
        >
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
      <div className="w-8 h-8 rounded-lg bg-[#F6F1E8] flex items-center justify-center shrink-0 mt-0.5">
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

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [pwdModalOpen, setPwdModalOpen] = useState(false)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [profileData, issuesData] = await Promise.all([
          getProfile(),
          getMyOwnIssues(),
        ])
        setProfile(profileData)
        setIssues(Array.isArray(issuesData) ? issuesData : [])
      } catch {
        toast.error('Could not load profile data.')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const total = issues.length
  const resolved = issues.filter((i) => i.status === 'resolved').length
  const reported = issues.filter((i) => i.status === 'reported').length
  const inProgress = issues.filter((i) => i.status === 'in_progress').length
  const filteredIssues = filter
    ? issues.filter((i) => i.status === filter)
    : issues

  const displayName =
    profile?.full_name ?? profile?.name ?? user?.name ?? 'User'
  const displayEmail = profile?.email ?? user?.email ?? '—'
  const displayPhone = profile?.phone ?? '—'
  const displayAddr = profile?.address ?? '—'
  const userId = profile?.id ?? user?.id ?? 'default'

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F1E8] py-8 px-4">
        <div className="max-w-5xl mx-auto space-y-5 animate-pulse">
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
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F1E8] py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="bg-[#FFFDF9] rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-20 bg-linear-to-r from-blue-500 to-blue-600" />
          <div className="px-6 pb-6">
            <div className="-mt-8 flex items-end justify-between mb-4">
              <EditableAvatar displayName={displayName} userId={userId} />
              <button
                onClick={() => setPwdModalOpen(true)}
                className="text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
              >
                Change Password
              </button>
            </div>
            <h1 className="text-xl font-black text-slate-900 mb-0.5">
              {displayName}
            </h1>
            <p className="text-sm text-slate-500">{displayEmail}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1">
            <div className="bg-[#FFFDF9] rounded-2xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Personal Information
              </h2>
              <InfoRow icon={User} label="Full Name" value={displayName} />
              <InfoRow icon={Mail} label="Email" value={displayEmail} />
              <InfoRow icon={Phone} label="Phone" value={displayPhone} />
              <InfoRow icon={MapPin} label="Address" value={displayAddr} />
            </div>
          </div>

          {/* Stats + Issues */}
          <div className="lg:col-span-2 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total', value: total, color: 'text-slate-800' },
                { label: 'Reported', value: reported, color: 'text-blue-600' },
                {
                  label: 'In Progress',
                  value: inProgress,
                  color: 'text-violet-600',
                },
                {
                  label: 'Resolved',
                  value: resolved,
                  color: 'text-emerald-600',
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-[#FFFDF9] rounded-2xl border border-slate-200 shadow-sm p-4 text-center"
                >
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-[#FFFDF9] rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  My Issues
                </h2>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="text-xs font-medium border border-slate-200 rounded-xl px-3 py-1.5 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">All</option>
                  <option value="reported">Reported</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              {filteredIssues.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <p className="text-slate-400 text-sm font-medium">
                    No issues found.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredIssues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {pwdModalOpen && (
        <ChangePasswordModal onClose={() => setPwdModalOpen(false)} />
      )}
    </div>
  )
}
