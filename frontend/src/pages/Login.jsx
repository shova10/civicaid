import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth'
import { loginUser, getMe } from '../services/auth'

const Login = () => {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  const onSubmit = async (data) => {
    try {
      const res = await loginUser(data)
      console.log('Raw login response:', res.data) // ← remove after confirming shape

      // Adjust these based on what Django actually returns
      const accessToken = res.data.access || res.data.accessToken
      const refreshToken = res.data.refresh || res.data.refreshToken

      // Save tokens first so getMe() request carries Authorization header
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      // Fetch full user profile
      const meRes = await getMe()
      console.log('Raw me response:', meRes.data) // ← remove after confirming shape
      const user = meRes.data

      login(user, accessToken, refreshToken)
      toast.success(
        `Welcome back, ${user.full_name || user.name || user.email}!`
      )

      // Redirect by role
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'staff') navigate('/staff')
      else navigate('/')
    } catch (err) {
      console.error('Login error:', err.response?.data) // ← shows exact Django error
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Login failed. Try again.'
      toast.error(message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back</h1>
        <p className="text-gray-500 mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
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

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-colors"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
