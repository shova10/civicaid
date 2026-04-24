import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShieldCheck, RefreshCw, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

async function verifyOTP(email, otp) {
  const response = await api.post('/api/auth/verify-otp/', { email, otp })
  return response.data
}

async function resendOTP(email) {
  const response = await api.post('/api/auth/resend-otp/', { email })
  return response.data
}

export default function VerifyOTP() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email ?? ''

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const inputRefs = useRef([])

  // Countdown for resend
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  function handleChange(index, value) {
    if (!/^\d*$/.test(value)) return // digits only
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // only last character
    setOtp(newOtp)

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)
    const newOtp = [...otp]
    pasted.split('').forEach((char, i) => {
      newOtp[i] = char
    })
    setOtp(newOtp)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  async function handleVerify() {
    const code = otp.join('')
    if (code.length < 6) {
      toast.error('Please enter the full 6-digit code')
      return
    }

    setVerifying(true)
    try {
      await verifyOTP(email, code)
      toast.success('Email verified successfully! Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Invalid or expired code.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setVerifying(false)
    }
  }

  async function handleResend() {
    if (countdown > 0) return
    setResending(true)
    try {
      await resendOTP(email)
      toast.success('New code sent to your email.')
      setCountdown(60)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Could not resend code.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100
            flex items-center justify-center mx-auto mb-5"
          >
            <ShieldCheck size={26} className="text-blue-500" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">
            Verify your email
          </h1>
          <p className="text-sm text-slate-500 text-center mb-2">
            We sent a 6-digit code to
          </p>
          <p className="text-sm font-semibold text-slate-700 text-center mb-8">
            {email || 'your email address'}
          </p>

          {/* OTP inputs */}
          <div
            className="flex items-center justify-center gap-3 mb-6"
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors
                  ${
                    digit
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-slate-200 text-slate-800'
                  }`}
              />
            ))}
          </div>

          {/* Verify button */}
          <button
            onClick={handleVerify}
            disabled={verifying || otp.join('').length < 6}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-200
              text-white font-semibold rounded-xl transition-colors mb-4"
          >
            {verifying ? 'Verifying…' : 'Verify Email'}
          </button>

          {/* Resend */}
          <div className="text-center">
            <p className="text-sm text-slate-500 mb-1">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={countdown > 0 || resending}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700
                disabled:text-slate-400 flex items-center gap-1.5 mx-auto
                transition-colors"
            >
              <RefreshCw
                size={13}
                className={resending ? 'animate-spin' : ''}
              />
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
            </button>
          </div>

          {/* Back */}
          <button
            onClick={() => navigate('/register')}
            className="mt-5 text-xs text-slate-400 hover:text-slate-600 flex
              items-center gap-1 mx-auto transition-colors"
          >
            <ArrowLeft size={12} />
            Back to register
          </button>
        </div>
      </div>
    </div>
  )
}
