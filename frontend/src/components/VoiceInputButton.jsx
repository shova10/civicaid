import { Mic, MicOff, AlertCircle } from 'lucide-react'
import useSpeechToText from '../hooks/useSpeechToText'

export default function VoiceInputButton({
  onTranscript,
  lang = 'en-US',
  className = '',
}) {
  const { listening, supported, error, start, stop } = useSpeechToText({
    onResult: onTranscript,
    lang,
  })

  if (!supported) return null // silently hide if browser doesn't support it

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <button
        type="button"
        onClick={listening ? stop : start}
        title={listening ? 'Stop recording' : 'Start voice input'}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5
          rounded-full border transition-all duration-200 select-none
          ${
            listening
              ? 'bg-red-500 text-white border-red-500 animate-pulse'
              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600'
          }`}
      >
        {listening ? (
          <>
            <MicOff size={12} strokeWidth={2.5} /> Stop
          </>
        ) : (
          <>
            <Mic size={12} strokeWidth={2.5} /> Voice
          </>
        )}
      </button>

      {listening && (
        <p className="text-[10px] text-red-500 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
          Listening…
        </p>
      )}

      {error && (
        <p className="text-[10px] text-red-500 flex items-start gap-1 max-w-xs">
          <AlertCircle size={10} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}
