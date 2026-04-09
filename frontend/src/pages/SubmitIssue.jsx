import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { MapPin, Upload, X, ImageIcon } from 'lucide-react'
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

const SubmitIssue = () => {
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [location, setLocation] = useState(null)
  const [locating, setLocating] = useState(false)
  const fileInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm()

  const navigate = useNavigate()

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
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported')
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setLocation({ latitude, longitude })
        toast.success('Location captured')
        setLocating(false)
      },
      () => {
        toast.error('Location failed')
        setLocating(false)
      }
    )
  }

  const handleFormSubmit = async (data) => {
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('category', data.category)

      if (imageFile) formData.append('image', imageFile)
      if (location) {
        formData.append('latitude', location.latitude)
        formData.append('longitude', location.longitude)
      }

      await submitIssue(formData)

      toast.success('Issue submitted!')
      reset()
      removeImage()
      setLocation(null)
      navigate('/my-issues')
    } catch (err) {
      const message =
        err?.response?.data?.message || 'Submission failed. Try again.'
      toast.error(message)
    }
  }

  return (
    <div className="bg-slate-50 py-2 px-2">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Report an Issue</h1>
          <p className="text-slate-500 mt-1">Help improve your community</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(handleFormSubmit)(e)
            }}
            className="space-y-6"
          >
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Issue Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Broken streetlight"
                className={`mt-1 w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
                  errors.title ? 'border-red-500' : 'border-slate-200'
                }`}
                {...register('title', { required: true, minLength: 5 })}
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Category *
              </label>
              <select
                className="mt-1 w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                {...register('category', { required: true })}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Description *
              </label>
              <textarea
                rows={4}
                className="mt-1 w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 resize-none"
                {...register('description', { required: true })}
              />
            </div>

            {/* Image */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Photo (optional)
              </label>

              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="mt-2 border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
                >
                  <ImageIcon className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500">Upload image</p>
                </div>
              ) : (
                <div className="mt-2 relative">
                  <img
                    src={imagePreview}
                    className="rounded-xl w-full max-h-60 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Location */}
            <div>
              <button
                type="button"
                onClick={handleGetLocation}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm hover:bg-slate-50"
              >
                <MapPin size={16} />
                {locating ? 'Detecting...' : 'Use My Location'}
              </button>

              {location && (
                <p className="text-green-600 text-sm mt-2">✓ Location added</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              {isSubmitting ? 'Submitting...' : 'Submit Issue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SubmitIssue
