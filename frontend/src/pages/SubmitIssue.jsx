// src/pages/SubmitIssue.jsx
import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { MapPin, Upload, X, ImageIcon, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { submitIssue } from '../services/issues'

const CATEGORIES = [
  'road',
  'water',
  'electricity',
  'sanitation',
  'safety',
  'parks',
  'other',
]

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
]

const SubmitIssue = () => {
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [location, setLocation] = useState(null)
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState(null)
  const fileInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: { priority: 'low' },
  })

  const navigate = useNavigate()

  // ── Image handling ──────────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }

    setImageFile(file)

    // Use FileReader to generate preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setImagePreview(event.target.result)
    }
    reader.onerror = () => {
      toast.error('Could not read image file')
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Location handling ───────────────────────────────────────────────────────
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    setLocating(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setLocation({ latitude, longitude })
        toast.success(
          `Location captured: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        )
        setLocating(false)
      },
      (err) => {
        setLocating(false)
        let message = 'Could not get location'
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message =
              'Location permission denied. Please allow location access in your browser settings.'
            break
          case err.POSITION_UNAVAILABLE:
            message =
              'Location unavailable. Try again or submit without location.'
            break
          case err.TIMEOUT:
            message = 'Location request timed out. Try again.'
            break
        }
        setLocationError(message)
        toast.error(message)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  // ── Form submit ─────────────────────────────────────────────────────────────
  const handleFormSubmit = async (data) => {
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('category', data.category)
      formData.append('priority', data.priority)

      if (imageFile) {
        formData.append('image', imageFile)
      }

      if (location) {
        formData.append('latitude', location.latitude)
        formData.append('longitude', location.longitude)
      }

      const result = await submitIssue(formData)

      if (result?.is_duplicate) {
        toast('Issue submitted — AI detected it may be a duplicate.', {
          icon: '⚠️',
          duration: 5000,
        })
      } else {
        toast.success('Issue submitted successfully!')
      }

      reset()
      removeImage()
      setLocation(null)
      setLocationError(null)
      navigate('/my-issues')
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Submission failed. Try again.'
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Report an Issue</h1>
          <p className="text-slate-500 mt-1">Help improve your community</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Issue Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Broken streetlight on main road"
                className={`mt-1 w-full px-4 py-2.5 border rounded-xl
                  focus:ring-2 focus:ring-blue-500/20 focus:outline-none
                  ${errors.title ? 'border-red-400' : 'border-slate-200'}`}
                {...register('title', {
                  required: 'Title is required',
                  minLength: {
                    value: 5,
                    message: 'Title must be at least 5 characters',
                  },
                })}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Category *
              </label>
              <select
                className={`mt-1 w-full px-4 py-2.5 border rounded-xl
                  focus:ring-2 focus:ring-blue-500/20 focus:outline-none
                  ${errors.category ? 'border-red-400' : 'border-slate-200'}`}
                {...register('category', {
                  required: 'Please select a category',
                })}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Priority *
              </label>
              <select
                className="mt-1 w-full px-4 py-2.5 border border-slate-200 rounded-xl
                  focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                {...register('priority', { required: true })}
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1">
                AI will also suggest a priority based on your description.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Description *
              </label>
              <textarea
                rows={4}
                placeholder="Describe the issue in detail — what happened, how severe it is, who is affected..."
                className={`mt-1 w-full px-4 py-2.5 border rounded-xl
                  focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none
                  ${errors.description ? 'border-red-400' : 'border-slate-200'}`}
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 20,
                    message:
                      'Please describe the issue in at least 20 characters',
                  },
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Image */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Photo (optional)
              </label>

              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8
                    text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50
                    transition-colors"
                >
                  <ImageIcon
                    className="mx-auto text-slate-400 mb-2"
                    size={28}
                  />
                  <p className="text-sm text-slate-500 font-medium">
                    Click to upload image
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={imagePreview}
                    alt="Issue preview"
                    className="w-full max-h-64 object-cover block"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600
                      text-white p-1.5 rounded-full transition-colors shadow-md"
                  >
                    <X size={14} />
                  </button>
                  <div
                    className="absolute bottom-2 left-2 bg-black/50 text-white
                    text-xs px-2 py-1 rounded-lg backdrop-blur-sm"
                  >
                    {imageFile?.name}
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Location (optional)
              </label>

              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locating}
                className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-xl
                  text-sm font-medium transition-colors
                  ${
                    location
                      ? 'border-green-300 bg-green-50 text-green-700'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  } disabled:opacity-60`}
              >
                <MapPin
                  size={16}
                  className={location ? 'text-green-600' : ''}
                />
                {locating
                  ? 'Detecting location…'
                  : location
                    ? `✓ ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                    : 'Use My Location'}
              </button>

              {location && (
                <button
                  type="button"
                  onClick={() => {
                    setLocation(null)
                    setLocationError(null)
                  }}
                  className="ml-2 text-xs text-slate-400 hover:text-red-500 underline"
                >
                  Remove
                </button>
              )}

              {locationError && (
                <div
                  className="mt-2 flex items-start gap-2 p-2.5 bg-red-50
                  rounded-xl border border-red-200"
                >
                  <AlertCircle
                    size={13}
                    className="text-red-400 mt-0.5 shrink-0"
                  />
                  <p className="text-xs text-red-600">{locationError}</p>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
                text-white font-semibold rounded-xl flex items-center justify-center gap-2
                transition-colors"
            >
              <Upload size={18} />
              {isSubmitting ? 'Submitting…' : 'Submit Issue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SubmitIssue
