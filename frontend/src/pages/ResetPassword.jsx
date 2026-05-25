import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { resetPassword } from '../services/auth'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const uid = searchParams.get('uid')
  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const newPwd = watch('new_password')

  const onSubmit = async (data) => {
    try {
      await resetPassword({
        uid,
        token,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      })
      toast.success('Password reset! Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          'Reset failed. The link may have expired.'
      )
    }
  }

  if (!uid || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F6F1E8]">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm w-full">
          <p className="text-red-500 font-semibold mb-4">Invalid reset link.</p>
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline text-sm"
          >
            Request a new one
          </Link>
        </div>
      </div>
    )
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

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Set new password
        </h1>
        <p className="text-gray-500 mb-8 text-sm">
          Choose a strong password for your account.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type={showNew ? 'text' : 'password'}
              placeholder="••••••••"
              className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                errors.new_password ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('new_password', {
                required: 'New password is required',
                minLength: {
                  value: 8,
                  message: 'Must be at least 8 characters',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowNew((s) => !s)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            {errors.new_password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.new_password.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                errors.confirm_password ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('confirm_password', {
                required: 'Please confirm your password',
                validate: (v) => v === newPwd || 'Passwords do not match',
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            {errors.confirm_password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600
            disabled:bg-amber-300 text-amber-950 font-bold rounded-xl transition-all"
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
