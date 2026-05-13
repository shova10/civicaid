import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Shield } from 'lucide-react'
import useAuth from '../hooks/useAuth'
import { registerUser } from '../services/auth'

const Register = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated])

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const onSubmit = async (data) => {
    try {
      await registerUser({
        username: data.email.split('@')[0],
        full_name: data.name,
        email: data.email,
        password: data.password,
        password2: data.confirmPassword,
        phone: data.phone,
        address: data.address,
        date_of_birth: data.dob,
      })

      toast.success('Account created! Please verify your email.')
      navigate('/verify-otp', { state: { email: data.email } })
    } catch (err) {
      const errData = err.response?.data
      toast.error(
        errData?.email?.[0] ||
          errData?.detail ||
          errData?.message ||
          'Registration failed. Please try again.'
      )
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
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
          Create account
        </h1>
        <p className="text-gray-500 mb-8">Get started for free</p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none
                focus:ring-2 focus:ring-blue-500
                ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              {...register('name', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              placeholder="98XXXXXXXX"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none
                focus:ring-2 focus:ring-blue-500
                ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              {...register('phone', {
                required: 'Phone number is required',
                minLength: { value: 10, message: 'Enter a valid phone number' },
              })}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none
                focus:ring-2 focus:ring-blue-500
                ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
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

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth *
            </label>
            <input
              type="date"
              max={
                new Date(new Date().setFullYear(new Date().getFullYear() - 10))
                  .toISOString()
                  .split('T')[0]
              }
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none
                focus:ring-2 focus:ring-blue-500 text-gray-700
                ${errors.dob ? 'border-red-500' : 'border-gray-300'}`}
              {...register('dob', {
                required: 'Date of birth is required',
                validate: (value) => {
                  const age =
                    new Date().getFullYear() - new Date(value).getFullYear()
                  return age >= 10 || 'You must be at least 10 years old'
                },
              })}
            />
            {errors.dob && (
              <p className="mt-1 text-sm text-red-500">{errors.dob.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <input
              type="text"
              placeholder="e.g. Baneshwor, Kathmandu"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none
                focus:ring-2 focus:ring-blue-500
                ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              {...register('address', {
                required: 'Address is required',
                minLength: {
                  value: 5,
                  message: 'Please enter a valid address',
                },
              })}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none
                focus:ring-2 focus:ring-blue-500
                ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password *
            </label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none
                focus:ring-2 focus:ring-blue-500
                ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === watch('password') || 'Passwords do not match',
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700
              disabled:bg-blue-300 text-white font-semibold rounded-lg
              transition-colors mt-2"
          >
            {isSubmitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
