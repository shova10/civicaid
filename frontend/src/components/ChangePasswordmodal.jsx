import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { changePassword } from '../services/auth'

export default function ChangePasswordmodal({ onClose }) {
  const [show, setShow] = useState({ old: false, new: false, confirm: false })

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const newPwd = watch('new_password')

  const toggle = (field) => setShow((s) => ({ ...s, [field]: !s[field] }))

  const onSubmit = async (data) => {
    try {
      await changePassword({
        old_password: data.old_password,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      })
      toast.success('Password changed successfully!')
      reset()
      onClose()
    } catch (err) {
      toast.error(
        err.response?.data?.old_password?.[0] ||
          err.response?.data?.detail ||
          err.response?.data?.message ||
          'Failed to change password.'
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-[#F6F1E8] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Lock size={13} className="text-blue-600" />
            </div>
            <h3 className="font-black text-slate-800 text-sm">
              Change Password
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="p-6 space-y-4"
        >
          <PasswordField
            label="Current Password"
            name="old_password"
            show={show.old}
            onToggle={() => toggle('old')}
            error={errors.old_password}
            register={register('old_password', {
              required: 'Current password is required',
            })}
          />

          {/* New password */}
          <PasswordField
            label="New Password"
            name="new_password"
            show={show.new}
            onToggle={() => toggle('new')}
            error={errors.new_password}
            register={register('new_password', {
              required: 'New password is required',
              minLength: {
                value: 8,
                message: 'Must be at least 8 characters',
              },
            })}
          />

          {/* Confirm new password */}
          <PasswordField
            label="Confirm New Password"
            name="confirm_password"
            show={show.confirm}
            onToggle={() => toggle('confirm')}
            error={errors.confirm_password}
            register={register('confirm_password', {
              required: 'Please confirm your new password',
              validate: (v) => v === newPwd || 'Passwords do not match',
            })}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function PasswordField({ label, show, onToggle, error, register }) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={show ? 'text' : 'password'}
        placeholder="••••••••"
        className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...register}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  )
}
