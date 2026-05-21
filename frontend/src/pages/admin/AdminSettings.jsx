import { useState, useEffect } from 'react'
import { Save, Globe, Bell, Tag, Shield, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'

const STORAGE_KEY = 'civicaid_settings'

const DEFAULTS = {
  siteName: 'CivicAid Nepal',
  siteEmail: 'support@civicaid.np',
  sitePhone: '+977-1-4444444',
  maxUpload: '5',
  emailOnNew: true,
  emailOnResolve: true,
  emailOnAssign: false,
  smsAlerts: false,
  mapEnabled: true,
  upvoteEnabled: true,
  aiClassify: false,
  publicIssues: false,
  categories: [
    'Road & Transport',
    'Water & Drainage',
    'Electricity',
    'Waste Management',
    'Public Safety',
    'Parks & Green',
    'Other',
  ],
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function SettingsSection({ icon: Icon, title, description, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
          {Icon && <Icon size={15} className="text-slate-500" />}
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800">{title}</h2>
          {description && (
            <p className="text-xs text-slate-400 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="px-5 py-4 space-y-4">{children}</div>
    </div>
  )
}

function SettingsField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5
          bg-white text-slate-700 placeholder:text-slate-300
          focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  )
}

function Toggle({ label, description, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {description && (
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2
          transition-colors duration-200 focus:outline-none
          ${value ? 'bg-blue-600 border-blue-600' : 'bg-slate-200 border-slate-200'}`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow transform
            transition-transform duration-200 mt-0.5
            ${value ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </button>
    </div>
  )
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(loadSettings)
  const [newCategory, setNewCategory] = useState('')
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  // Track unsaved changes
  useEffect(() => {
    setDirty(true)
  }, [settings])

  function set(key) {
    return (value) => setSettings((prev) => ({ ...prev, [key]: value }))
  }

  function handleAddCategory() {
    const trimmed = newCategory.trim()
    if (!trimmed || settings.categories.includes(trimmed)) return
    setSettings((prev) => ({
      ...prev,
      categories: [...prev.categories, trimmed],
    }))
    setNewCategory('')
  }

  function handleRemoveCategory(cat) {
    if (settings.categories.length <= 1) {
      toast.error('At least one category is required.')
      return
    }
    setSettings((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== cat),
    }))
  }

  function handleSave() {
    setSaving(true)
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
        setDirty(false)
        toast.success('Settings saved.')
      } catch {
        toast.error('Could not save settings.')
      } finally {
        setSaving(false)
      }
    }, 400)
  }

  function handleReset() {
    setSettings(DEFAULTS)
    localStorage.removeItem(STORAGE_KEY)
    toast.success('Settings reset to defaults.')
  }

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Platform configuration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600
              px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Reset defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white
              bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
              px-4 py-2.5 rounded-xl transition-colors"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save size={14} /> Save{dirty ? ' *' : ''}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {/* Platform info */}
        <SettingsSection
          icon={Globe}
          title="Platform Information"
          description="Basic details about your CivicAid installation"
        >
          <SettingsField
            label="Platform Name"
            value={settings.siteName}
            onChange={set('siteName')}
            placeholder="CivicAid Nepal"
          />
          <SettingsField
            label="Support Email"
            value={settings.siteEmail}
            onChange={set('siteEmail')}
            placeholder="support@civicaid.np"
            type="email"
          />
          <SettingsField
            label="Support Phone"
            value={settings.sitePhone}
            onChange={set('sitePhone')}
            placeholder="+977-1-4444444"
          />
          <SettingsField
            label="Max Image Upload Size (MB)"
            value={settings.maxUpload}
            onChange={set('maxUpload')}
            placeholder="5"
            type="number"
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection
          icon={Bell}
          title="Notifications"
          description="Control when email and SMS alerts are sent"
        >
          <Toggle
            label="Email on new issue"
            description="Send email to admin when a new issue is submitted"
            value={settings.emailOnNew}
            onChange={set('emailOnNew')}
          />
          <div className="h-px bg-slate-100" />
          <Toggle
            label="Email on issue resolved"
            description="Notify citizen when their issue is marked resolved"
            value={settings.emailOnResolve}
            onChange={set('emailOnResolve')}
          />
          <div className="h-px bg-slate-100" />
          <Toggle
            label="Email on staff assignment"
            description="Notify staff when an issue is assigned to them"
            value={settings.emailOnAssign}
            onChange={set('emailOnAssign')}
          />
          <div className="h-px bg-slate-100" />
          <Toggle
            label="SMS alerts"
            description="Send SMS for critical priority issues (requires Twilio)"
            value={settings.smsAlerts}
            onChange={set('smsAlerts')}
          />
        </SettingsSection>

        {/* Features */}
        <SettingsSection
          icon={Shield}
          title="Feature Toggles"
          description="Enable or disable platform features"
        >
          <Toggle
            label="Issue Map"
            description="Show the interactive Leaflet map for all users"
            value={settings.mapEnabled}
            onChange={set('mapEnabled')}
          />
          <div className="h-px bg-slate-100" />
          <Toggle
            label="Upvoting"
            description="Allow citizens to upvote issues"
            value={settings.upvoteEnabled}
            onChange={set('upvoteEnabled')}
          />
          <div className="h-px bg-slate-100" />
          <Toggle
            label="AI Auto-classification"
            description="Use AI to suggest categories when submitting issues"
            value={settings.aiClassify}
            onChange={set('aiClassify')}
          />
          <div className="h-px bg-slate-100" />
          <Toggle
            label="Public issue list"
            description="Allow non-logged-in users to browse issues"
            value={settings.publicIssues}
            onChange={set('publicIssues')}
          />
        </SettingsSection>

        {/* Categories */}
        <SettingsSection
          icon={Tag}
          title="Issue Categories"
          description="Manage the categories citizens can select when submitting"
        >
          <div className="flex flex-wrap gap-2">
            {settings.categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 text-xs font-semibold
                  px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
              >
                {cat}
                <button
                  onClick={() => handleRemoveCategory(cat)}
                  className="text-slate-400 hover:text-red-500 transition-colors ml-0.5"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              placeholder="Add new category…"
              className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2
                bg-white text-slate-700 placeholder:text-slate-300
                focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              onClick={handleAddCategory}
              disabled={!newCategory.trim()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold
                text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-200
                px-3 py-2 rounded-xl transition-colors"
            >
              <Plus size={12} /> Add
            </button>
          </div>
        </SettingsSection>
      </div>

      <p className="text-xs text-slate-300 text-center mt-6">
        Saved locally in your browser · connect to{' '}
        <code className="font-mono">GET /api/admin/settings/</code> to persist
        server-side
      </p>
    </div>
  )
}
