import { useState, useRef, useCallback } from 'react'

export default function useSpeechToText({ onResult, lang = 'en-US' } = {}) {
  const [listening, setListening] = useState(false)
  const [supported] = useState(
    typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  )
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)

  const start = useCallback(() => {
    if (!supported) {
      setError(
        'Speech recognition is not supported in this browser. Try Chrome or Edge.'
      )
      return
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    const recognition = new SpeechRecognition()
    recognition.lang = lang
    recognition.interimResults = true // show partial results while speaking
    recognition.maxAlternatives = 1
    recognition.continuous = false // stop after one phrase

    recognition.onstart = () => {
      setListening(true)
      setError(null)
    }

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join('')

      if (event.results[event.results.length - 1].isFinal) {
        onResult?.(transcript)
      }
    }

    recognition.onerror = (event) => {
      setListening(false)
      switch (event.error) {
        case 'not-allowed':
          setError(
            'Microphone access denied. Please allow microphone permission.'
          )
          break
        case 'no-speech':
          setError('No speech detected. Please try again.')
          break
        case 'network':
          setError('Network error. Speech recognition requires internet.')
          break
        default:
          setError(`Speech error: ${event.error}`)
      }
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [supported, lang, onResult])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  return { listening, supported, error, start, stop }
}
