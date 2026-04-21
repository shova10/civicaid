import { useState } from 'react'
import { Globe, ChevronDown } from 'lucide-react'

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ne', label: 'नेपाली', flag: '🇳🇵' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mai', label: 'मैथिली', flag: '🇳🇵' },
]

export default function LanguageSelector({ value = 'en', onChange }) {
  const [open, setOpen] = useState(false)
  const selected = LANGUAGES.find((l) => l.code === value) ?? LANGUAGES[0]

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5
          bg-white border border-slate-200 rounded-xl hover:border-slate-300
          text-slate-600 transition-colors"
      >
        <Globe size={12} />
        <span>
          {selected.flag} {selected.label}
        </span>
        <ChevronDown
          size={11}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute top-full mt-1 left-0 z-20 bg-white rounded-xl
            border border-slate-200 shadow-lg py-1 min-w-[140px]"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  onChange(lang.code)
                  setOpen(false)
                }}
                className={`w-full text-left text-xs px-3 py-2 hover:bg-slate-50
                  transition-colors flex items-center gap-2
                  ${value === lang.code ? 'text-blue-600 font-semibold' : 'text-slate-700 font-medium'}`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
