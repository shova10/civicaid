import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { MapPin, Upload, X, ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { submitIssue } from '../services/issues'

const CATEGORIES = [
  'Road & Infrastructure',
  'Water & Drainage',
  'Electricity',
  'Waste & Sanitation',
  'Public Safety',
  'Parks & Recreation',
  'Other',
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

  // Image upload handler
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

  // GPS handler
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ latitude, longitude })
        toast.success('Location captured!')
        setLocating(false)
      },
      () => {
        toast.error('Unable to retrieve location. Check browser permissions.')
        setLocating(false)
      }
    )
  }

 const handleFormSubmit = async (data) => {
  try {
    const formData = new FormData()

    // Text fields
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('category', data.category)

    // Image — only append if user selected one
    if (imageFile) {
      formData.append('image', imageFile)
    }

    // GPS — only append if user captured location
    if (location) {
      formData.append('latitude', location.latitude)
      formData.append('longitude', location.longitude)
    }

    await submitIssue(formData)

    toast.success('Issue submitted successfully!')
    reset()
    removeImage()
    setLocation(null)

  } catch (err) {
    const message = err.response?.data?.message || 'Submission failed. Try again.'
    toast.error(message)
  }
}
  

  return (
    <div className="max-w-2xl mx-auto mt-5">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Submit an Issue</h1>
        <p className="text-gray-500 mt-1">
          Report a civic problem in your area
        </p>
      </div>

      <form
        // eslint-disable-next-line react-hooks/refs
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
        className="space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issue Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Large pothole on Main Street"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('title', {
              required: 'Title is required',
              minLength: {
                value: 5,
                message: 'Title must be at least 5 characters',
              },    
              maxLength: {
                value: 100,
                message: 'Title must be under 100 characters',
              },
            })}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('category', { required: 'Please select a category' })}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            placeholder="Describe the issue in detail — what it is, how long it's been there, any safety concerns..."
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('description', {
              required: 'Description is required',
              minLength: {
                value: 20,
                message: 'Please provide at least 20 characters',
              },
              maxLength: {
                value: 1000,
                message: 'Description must be under 1000 characters',
              },
            })}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photo{' '}
            <span className="text-gray-400 font-normal">
              (optional, max 5MB)
            </span>
          </label>

          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <ImageIcon className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-sm text-gray-500">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, WEBP up to 5MB
              </p>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden border border-gray-200">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-64 object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
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

        {/* GPS Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location{' '}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locating}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <MapPin
                size={16}
                className={
                  locating ? 'animate-pulse text-blue-500' : 'text-gray-500'
                }
              />
              {locating ? 'Detecting...' : 'Use My Location'}
            </button>

            {location && (
              <span className="text-sm text-green-600 font-medium">
                ✓ {location.latitude.toFixed(5)},{' '}
                {location.longitude.toFixed(5)}
              </span>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mb-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Upload size={18} />
            {isSubmitting ? 'Submitting...' : 'Submit Issue'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SubmitIssue
