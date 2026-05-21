import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth'
import { loginUser, getProfile } from '../services/auth'
import { Eye, EyeOff, Shield } from 'lucide-react'

const Login = () => {
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') navigate('/admin', { replace: true })
      else if (user.role === 'staff') navigate('/staff', { replace: true })
      else navigate('/home', { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  const onSubmit = async (data) => {
    try {
      const res = await loginUser(data)

      const accessToken =
        res.data.access || res.data.accessToken || res.data.token
      const refreshToken =
        res.data.refresh || res.data.refreshToken || res.data.token

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      const user = await getProfile()

      login(user, accessToken, refreshToken)

      toast.success(
        `Welcome back, ${user.full_name || user.name || user.email}!`
      )

      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'staff') navigate('/staff')
      else navigate('/home')
    } catch (err) {
      toast.error(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          'Login failed. Try again.'
      )
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F6F1E8] px-4">
      <div className="w-full max-w-md bg-[#FFFDF9] border border-slate-200 rounded-2xl shadow-sm p-8">
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

        <h1 className="text-3xl font-black text-slate-900 mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500 mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className={`w-full px-4 py-2.5 border rounded-lg outline-none
                focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400
                ${errors.email ? 'border-red-400' : 'border-slate-200'}`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
            />

            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-5 relative">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Password
            </label>

            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 pr-10 border rounded-lg outline-none
                focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400
                ${errors.password ? 'border-red-400' : 'border-slate-200'}`}
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
              className="absolute right-3 top-9 text-slate-500 hover:text-slate-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
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
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-indigo-700 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
