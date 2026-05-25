import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Shield, ArrowLeft, Mail } from 'lucide-react'
import { forgotPassword } from '../services/auth'

const ForgotPassword = () => {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email)
      setSent(true)
    } catch (err) {
      toast.error(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          'Something went wrong. Please try again.'
      )
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F6F1E8]">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[10px_3px_10px_3px] bg-indigo-700 flex items-center justify-center shadow-sm">
              <Shield size={15} className="text-white" />
            </div>
            <span className="text-[22px] font-black tracking-tight text-slate-900">
              Civic<span className="text-indigo-700">Aid</span>
            </span>
          </Link>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4">
              <Mail size={24} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Check your email
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              We sent a password reset link to{' '}
              <span className="font-semibold text-gray-700">
                {getValues('email')}
              </span>
              . Check your inbox and follow the instructions.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium"
            >
              <ArrowLeft size={14} />
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Forgot password?
            </h1>
            <p className="text-gray-500 mb-8 text-sm">
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600
              disabled:bg-amber-300 text-amber-950 font-bold rounded-xl
              transition-all"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Remember your password?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
